// eslint-disable-next-line no-unused-expressions
'use strict'

import _ from 'lodash'
import log from 'loglevel'
import PersistenceService from './PersistenceService'

export default class WorkService extends PersistenceService {
  // class WorkService extends PersistenceService {
  // constructor() {
  //   super()
  //   log.debug('WorkService initialized')
  // }

  // Tested
  async getWorksList(customFilters) {
    var query = 'SELECT * FROM vTrabajos WHERE 1=1'
    if (customFilters !== undefined) {
      if (customFilters.fEntrada !== undefined) {
        query += this._processDateQuery('FechaEntrada', customFilters.fEntrada)
      }
      if (customFilters.fPrevista !== undefined) {
        query += this._processDateQuery('FechaPrevista', customFilters.fPrevista)
      }
      if (customFilters.fSalida !== undefined) {
        query += this._processDateQuery('FechaTerminacion', customFilters.fSalida)
      }
      if (customFilters.tipo !== undefined && customFilters.tipo.length > 0) {
        query += this._processTypeQuery('TipoTrabajo', customFilters.tipo)
      }
      if (customFilters.IdDentista !== undefined) {
        query += ` AND IdDentista = ${customFilters.IdDentista}`
      }
    }

    return this.allAsync(query, [])
  }

  _processTypeQuery(field, values) {
    var returnedValue = ` AND ${field} IN (`
    _.forEach(values, (value) => {
      returnedValue += `"${value}",`
    })

    return returnedValue.substring(0, returnedValue.length - 1) + ')'
  }

  _processDateQuery(field, value) {
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

  // Tested
  async getWork(workId) {
    var query = 'SELECT * FROM vTrabajos ' +
      'WHERE IdTrabajo = ?'
    return this.getAsync(query, [workId])
  }

  // Tested
  async insertWork(work) {
    var query = 'INSERT INTO Trabajos (IdDentista, IdTipoTrabajo, ' +
      'Paciente, Color, FechaTerminacion, FechaEntrada, ' +
      'FechaPrevista, FechaPrevistaPrueba, PrecioFinal, PrecioMetal) ' +
      'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    var id = await this.runAsync(query, [work.IdDentista, work.IdTipoTrabajo, work.Paciente,
      work.Color, work.FechaTerminacion, work.FechaEntrada, work.FechaPrevista, work.FechaPrevistaPrueba,
      work.PrecioFinal, work.PrecioMetal
    ])
    log.info(`Created the work ${id}`)
    return id
  }

  // Tested
  async updateWork(work) {
    var query = 'UPDATE Trabajos SET IdDentista = ?, IdTipoTrabajo = ?, ' +
      'Paciente = ?, Color = ?, FechaTerminacion = ?, ' +
      'FechaEntrada = ?, FechaPrevista = ?, FechaPrevistaPrueba = ?, ' +
      'PrecioMetal = ?, Nombre = ? ' +
      'WHERE IdTrabajo = ?'
    log.info(`Updating the work ${work.IdTrabajo}`)
    return this.runAsync(query, [work.IdDentista, work.IdTipoTrabajo, work.Paciente,
      work.Color, work.FechaTerminacion, work.FechaEntrada, work.FechaPrevista, work.FechaPrevistaPrueba,
      work.PrecioMetal, work.Nombre, work.IdTrabajo
    ])
  }
}