// eslint-disable-next-line no-unused-expressions
'use strict'

import log from 'loglevel'
import PersistenceService from './PersistenceService'

export default class WorkService extends PersistenceService {
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

  // Tested
  async getWorkTypes() {
    var query = 'SELECT IdTipoTrabajo, Descripcion FROM TipoTrabajos'

    return this.allAsync(query, [])
  }
}