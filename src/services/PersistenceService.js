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

  async loadDbFile(file) {
    var dbFile = file
    this.readonly = this.configFileService.configGet('readonly')
    try {
      if (!file) {
        dbFile = this.configFileService.configGet('dataFile')
      }
      const fs = require('fs')
      if (!fs.existsSync(dbFile)) {
        // No file to open
        log.error(`${this.configFileService.configGet('dataFile')} doesn't exists or not accesible`)
        return undefined
      }

      this.db = new Database(dbFile, {
        timeout: 8000,
        // verbose: console.log
      })

      var x = await this.getConfigValue('companyName')
      if (!x) {
        // Looks not to be a good sqlite database. Reject it
        log.error(`${this.configFileService.configGet('dataFile')} is not a good sqlite file`)
        return undefined
      }
    } catch (err) {
      // Looks not to be a good sqlite database. Reject it
      log.error(`Error loading the database file: ${JSON.stringify(err)}`)
      log.warn(`${this.configFileService.configGet('dataFile')} is not a good sqlite file`)
      return undefined
    }
    require('electron').ipcRenderer.send('file:opened', dbFile.replace(/^.*[\\/]/, '').replace(/\.[^/.]+$/, ''))
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

  // Runs the SQL query with the specified parameters and returns the first result row afterwards
  async getAsync(sql, params) {
    if (!this.db) {
      await this.loadDbFile()
    }
    try {
      return this.db.prepare(sql).get(params)
    } catch (err) {
      log.error(`SQL GetOne Error. Query: ${sql} | Params: ${params} | Error: ${err.stack}`)
    }
  }

  // Runs the SQL query with the specified parameters and returns all result rows afterwards.
  async allAsync(sql, params) {
    if (!this.db) {
      await this.loadDbFile()
    }
    try {
      return this.db.prepare(sql).all(params)
    } catch (err) {
      log.error(`SQL GetAll Error. Query: ${sql} | Params: ${params} | Error: ${err.stack}`)
    }
  }

  // Runs the SQL query with the specified parameters. It does not retrieve any result data.
  async runAsync(sql, params) {
    if (this.readonly) {
      // Nothing to do. The database was opened in read-only mode.
      return null
    }
    if (!this.db) {
      await this.loadDbFile()
    }
    try {
      var data = this.db.prepare(sql).run(params)
      if (data) {
        return data.lastInsertRowid
      }
    } catch (err) {
      log.error(`SQL Run Error. Query: ${sql} | Params: ${params} | Error: ${err.stack}`)
    }
  }
}