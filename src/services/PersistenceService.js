// eslint-disable-next-line no-unused-expressions
'use strict'

import ConfigFileService from './ConfigFileService'
import log from 'loglevel'
import _ from 'lodash'

export default class PersistenceService {
  constructor() {
    log.debug('PersistenceService initialized')
    this.configFileService = new ConfigFileService()
  }

  async loadDbFile() {
    try {
      var dbFile = this.configFileService.configGet('dataFile')
      // eslint-disable-next-line space-unary-ops
      this.db = new(require('sqlite3').verbose()).Database(dbFile)
      this.db.configure('busyTimeout', 5000)
      var x = await this.getConfigValue('companyName')
      if (!x) {
        // Looks not to be a good sqlite database. Reject it
        log.error(`${this.configFileService.configGet('dataFile')} is not a good sqlite file`)
        return undefined
      }
    } catch (err) {
      // Looks not to be a good sqlite database. Reject it
      log.error(`${this.configFileService.configGet('dataFile')} is not a good sqlite file`)
      return undefined
    }
    // eslint-disable-next-line no-useless-escape
    require('electron').ipcRenderer.send('file:opened', this.db.filename.replace(/^.*[\\\/]/, '').replace(/\.[^/.]+$/, ''))
    log.debug(`File ${this.db.filename} opened `)
    return this.db
  }

  // Tested
  async getConfigValue(configKey) {
    var query = 'SELECT Valor FROM Configuracion WHERE clave = ?'
    var x = await this.getAsync(query, [configKey])
    log.debug('Retreived the shared config values stored in the DB.')
    // log.debug(`Config values: ${JSON.stringify(x)}`)
    return (x).valor
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
    var query = 'INSERT OR REPLACE INTO Configuracion (clave, valor) VALUES (?, ?)'
    return this.runAsync(query, [configKey, configValue])
  }

  _processTypeQuery(field, values) {
    var returnedValue = ` AND ${field} IN (`
    _.forEach(values, (value) => {
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
    return new Promise((resolve) => setTimeout(resolve, milis))
  }

  async getAsync(sql, params) {
    if (!this.db) {
      await this.loadDbFile()
    }

    return new Promise((resolve, reject) => {
      this.db.get(sql, params, function (err, row) {
        if (err) {
          reject(err)
          log.error(`SQL Error. Params: ${params}| Query: ${sql}`)
        } else {
          resolve(row)
        }
      })
    })
  }

  async allAsync(sql, params) {
    if (!this.db) {
      await this.loadDbFile()
    }
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, function (err, row) {
        if (err) {
          log.error(`SQL Error. Params: ${params}| Query: ${sql}`)
          reject(err)
        } else {
          resolve(row)
        }
      })
    })
  }

  async runAsync(sql, params) {
    if (!this.db) {
      await this.loadDbFile()
    }
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function (err, row) {
        if (err) {
          log.error(`SQL Error. Params: ${params}| Query: ${sql}`)
          reject(err)
        } else {
          resolve(this.lastID)
        }
      })
    })
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