// eslint-disable-next-line no-unused-expressions
'use strict'

import ConfigFileService from './ConfigFileService'
import log from 'loglevel'
import _ from 'lodash'
import Database from 'better-sqlite3'

export default class PersistenceService {
  constructor() {
    log.debug('PersistenceService initialized')
    this.configFileService = new ConfigFileService()
  }

  async loadDbFile() {
    try {
      var dbFile = this.configFileService.configGet('dataFile')
      // eslint-disable-next-line space-unary-ops
      // this.db = new(require('sqlite3').verbose()).Database(dbFile)
      // this.db.configure('busyTimeout', 5000)
      this.db = new Database(dbFile, {
        timeout: 8000,
        verbose: console.log
      })
      var x = await this.getConfigValue('companyName')
      if (!x) {
        // Looks not to be a good sqlite database. Reject it
        log.error(`${this.configFileService.configGet('dataFile')} is not a good sqlite file`)
        return undefined
      }
    } catch (err) {
      // Looks not to be a good sqlite database. Reject it
      log.error(JSON.stringify(err))
      log.warn(`${this.configFileService.configGet('dataFile')} is not a good sqlite file`)
      return undefined
    }
    require('electron').ipcRenderer.send(
      'file:opened',
      // this.db.filename.replace(/^.*[\\/]/, '').replace(/\.[^/.]+$/, '')
      dbFile.replace(/^.*[\\/]/, '').replace(/\.[^/.]+$/, '')
    )
    return this.db
  }

  // Tested
  async getConfigValue(configKey) {
    var query = 'SELECT Valor FROM Configuracion WHERE clave = ?'
    var x = await this.getAsync(query, [configKey])
    log.debug('Retreived the shared config values stored in the DB.')
    return x.valor
  }

  // tested
  async getConfigValues(configKeyArray) {
    var query = 'SELECT * FROM Configuracion'
    if (configKeyArray !== undefined) {
      query += ' WHERE clave IN ('
      for (var value of configKeyArray) {
        query += `"${value}",`
      }
      query = query.substring(0, query.length - 1) + ')'
    }

    return this.allAsync(query, [])
  }

  async setConfigValue(configKey, configValue) {
    log.debug(`Updating the config key ${configKey} with the value ${configValue}`)
    var query = 'INSERT OR REPLACE INTO Configuracion (clave, valor) VALUES (?, ?)'
    return this.runAsync(query, [configKey, configValue])
  }

  _processTypeQuery(field, values) {
    var returnedValue = ` AND ${field} IN (`
    _.forEach(values, value => {
      returnedValue += `"${value}",`
    })

    return returnedValue.substring(0, returnedValue.length - 1) + ')'
  }

  processDateQuery(field, value) {
    switch (value) {
      case 'Hoy':
        return ` AND (${field} BETWEEN date("now","localtime") AND  date("now", "localtime", "+1 day"))`
      case 'Esta semana':
        return ` AND (${field} BETWEEN date('now', 'weekday 1', '-7 day') AND date('now', 'weekday 1', '-1 day'))`
      case 'Últimos 7 días':
        return ` AND (${field} BETWEEN date("now", "localtime", "-7 day") AND date("now", "localtime", "+1 day"))`
      case 'Últimos 15 días':
        return ` AND (${field} BETWEEN date("now", "localtime", "-15 day") AND date("now", "localtime", "+1 day"))`
      case 'Últimos 30 días':
        return ` AND (${field} BETWEEN date("now", "localtime", "-30 day") AND date("now", "localtime", "+1 day"))`
      case 'Este mes':
        return ` AND (${field} BETWEEN date("now", "localtime", "start of month") AND date("now", "localtime", "start of month", "+1 month", "-1 day"))`
      case 'Mes pasado':
        return ` AND (${field} BETWEEN date("now", "localtime", "start of month", "-1 month") AND date("now", "localtime"))`
      case 'Hace dos meses':
        return ` AND (${field} BETWEEN date("now", "localtime", "start of month", "-2 month") AND date("now", "localtime"))`
      case 'Hace tres meses':
        return ` AND (${field} BETWEEN date("now", "localtime", "start of month", "-3 month") AND date("now", "localtime"))`
      case 'Hace seis meses':
        return ` AND (${field} BETWEEN date("now", "localtime", "start of month", "-6 month") AND date("now", "localtime"))`
      case 'Ninguna':
        return ` AND (${field} is null)`
      case 'Ninguna o en el futuro':
        return ` AND (${field} is null OR ${field} > date("now", "localtime"))`
      default:
        throw 'Not recognized the WHERE parameter ' + value
    }
  }

  async delay(milis) {
    return new Promise(resolve => setTimeout(resolve, milis))
  }

  // Runs the SQL query with the specified parameters and returns the first result row afterwards
  async getAsync2(sql, params) {
    if (!this.db) {
      await this.loadDbFile()
    }

    return new Promise((resolve, reject) => {
      this.db.get(sql, params, function (err, row) {
        if (err) {
          log.error(`SQL GetOne Error. Query: ${sql} | Params: ${params} | Error: ${JSON.stringify(err)}`)
          reject(err)
        } else {
          // log.debug(`SQL GetOne. Query: ${sql} | Params: ${params} | Result: ${JSON.stringify(row)}`)
          log.debug(`SQL GetOne. Query: ${sql} | Params: ${params}`)
          resolve(row)
        }
      })
    })
  }

  async getAsync(sql, params) {
    if (!this.db) {
      await this.loadDbFile()
    }
    try {
      return this.db.prepare(sql).get(params)
    } catch (err) {
      log.error(`SQL GetOne Error. Query: ${sql} | Params: ${params} | Error: ${JSON.stringify(err)}`)
    }
  }

  // Runs the SQL query with the specified parameters and returns all result rows afterwards.
  async allAsync2(sql, params) {
    if (!this.db) {
      await this.loadDbFile()
    }
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, function (err, rows) {
        if (err) {
          log.error(`SQL GetAll Error. Query: ${sql} | Params: ${params} | Error: ${JSON.stringify(err)}`)
          reject(err)
        } else {
          // log.debug(`SQL GetAll. Query: ${sql} | Params: ${params} | Results: ${JSON.stringify(rows)}`)
          log.debug(`SQL GetAll. Query: ${sql} | Params: ${params}`)
          resolve(rows)
        }
      })
    })
  }

  async allAsync(sql, params) {
    if (!this.db) {
      await this.loadDbFile()
    }
    let returnedValue
    try {
      const statement = this.db.prepare(sql)
      returnedValue = statement.all(params)
      // return this.db.prepare(sql).all(params)
      return returnedValue
    } catch (err) {
      log.error(`SQL GetAll Error. Query: ${sql} | Params: ${params} | Error: ${JSON.stringify(err)}`)
    }
  }

  // Runs the SQL query with the specified parameters. It does not retrieve any result data.
  async runAsync2(sql, params) {
    if (!this.db) {
      await this.loadDbFile()
    }
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function (err, row) {
        if (err) {
          log.error(`SQL Run Error. Query: ${sql} | Params: ${params} | Error: ${JSON.stringify(err)}`)
          reject(err)
        } else {
          log.debug(`SQL Run. Query: ${sql} | Params: ${params}`)
          resolve(this.lastID)
        }
      })
    })
  }

  async runAsync(sql, params) {
    if (!this.db) {
      await this.loadDbFile()
    }
    try {
      this.db.prepare(sql).run(params)
    } catch (err) {
      log.error(`SQL Run Error. Query: ${sql} | Params: ${params} | Error: ${JSON.stringify(err)}`)
    }
  }

  // function createTable() {
  //   db.run('CREATE TABLE TipoTrabajos (' +
  //     '    IdTipoTrabajo INTEGER PRIMARY KEY AUTOINCREMENT,' +
  //     '    Descripcion   TEXTO   NOT NULL);', insertValueObjects)
  // }

  // function insertValueObjects() {
  //   var batch = db.prepare('INSERT INTO TipoTrabajos (IdTipoTrabajo, Descripcion) VALUES (?, ?)')
  //   batch.run(1, 'Fija')
  //   batch.run(2, 'Resina')
  //   batch.run(3, 'Ortodoncia')
  //   batch.run(4, 'Esquelético')
  //   batch.run(5, 'Zirconio')
  //   batch.run(6, 'Compostura')
  //   batch.run(7, 'Implante')
  //   batch.finalize()
  //   db.close()
  // }

  // export function createNewDatabase() {
  //   db = new sqlite3.Database(configGet('dataFile'), createTable)
  // }
}