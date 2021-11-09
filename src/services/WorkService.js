'use strict'

import log from 'loglevel'
import PersistenceService from './PersistenceService'

export default class WorkService extends PersistenceService {
  // Tested
  async getWorksList(customFilters) {
    var query = 'SELECT * FROM vTrabajos WHERE 1=1'
    if (customFilters) {
      if (customFilters.fEntrada) {
        query += this.processDateQuery('FechaEntrada', customFilters.fEntrada)
      }
      if (customFilters.fPrevista) {
        query += this.processDateQuery('FechaPrevista', customFilters.fPrevista)
      }
      if (customFilters.fSalida) {
        query += this.processDateQuery('FechaTerminacion', customFilters.fSalida)
      }
      if (customFilters.tipo && customFilters.tipo.length > 0) {
        query += this.processTypeQuery('TipoTrabajo', customFilters.tipo)
      }
      if (customFilters.IdDentista) {
        query += ` AND IdDentista = ${customFilters.IdDentista}`
      }
    }

    return this.allAsync(query, [])
  }

  // Tested
  async getWork(workId) {
    var query = 'SELECT * FROM vTrabajos ' + 'WHERE IdTrabajo = ?'
    return this.getAsync(query, [workId])
  }

  // Tested
  async insertWork(work) {
    var query = 'INSERT INTO Trabajos (IdDentista, IdTipoTrabajo, ' +
      'Paciente, Color, FechaTerminacion, FechaEntrada, ' +
      'FechaPrevista, FechaPrevistaPrueba, PrecioConDescuento, PrecioMetal, PorcentajeDescuento, TotalDescuento, PrecioSinDescuento) ' +
      'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    var id = await this.runAsync(query, [work.IdDentista, work.IdTipoTrabajo, work.Paciente,
      work.Color, work.FechaTerminacion, work.FechaEntrada, work.FechaPrevista, work.FechaPrevistaPrueba,
      work.PrecioConDescuento, work.PrecioMetal, work.PorcentajeDescuento, work.TotalDescuento, work.PrecioSinDescuento
    ])
    log.info(`Created the work ${id}`)
    if (work.PrecioConDescuento === null || work.PrecioConDescuento === undefined) {
      log.error(`Inserted work ${id} has the PrecioConDescuento empty`)
    }
    return id
  }

  // Tested
  async updateWork(work) {
    var query = 'UPDATE Trabajos SET IdDentista = ?, IdTipoTrabajo = ?, ' +
      'Paciente = ?, Color = ?, FechaTerminacion = ?, ' +
      'FechaEntrada = ?, FechaPrevista = ?, FechaPrevistaPrueba = ?, ' +
      'PrecioMetal = ?, Nombre = ?, PorcentajeDescuento = ?, ' +
      'TotalDescuento = ?, PrecioConDescuento = ?, ' +
      'PrecioSinDescuento = ? ' +
      'WHERE IdTrabajo = ?'
    log.info(`Updating the work ${work.IdTrabajo}`)
    if (work.PrecioConDescuento === null || work.PrecioConDescuento === undefined) {
      log.error(`Updated work ${work.IdTrabajo} has the PrecioConDescuento empty`)
    }
    return this.runAsync(query, [work.IdDentista, work.IdTipoTrabajo, work.Paciente,
      work.Color, work.FechaTerminacion, work.FechaEntrada, work.FechaPrevista, work.FechaPrevistaPrueba,
      work.PrecioMetal, work.Nombre, work.PorcentajeDescuento, work.TotalDescuento, work.PrecioConDescuento,
      work.PrecioSinDescuento, work.IdTrabajo
    ])
  }

  async updateWorkDiscount(workId, percentageDiscount, totalDiscount, grandTotal) {
    var query = 'UPDATE Trabajos SET PorcentajeDescuento = ?, ' +
      'TotalDescuento = ?, ' +
      'PrecioConDescuento = ? ' +
      'WHERE IdTrabajo = ?'
    log.info(`Updating the discounts of work ${workId}`)
    return this.runAsync(query, [percentageDiscount, totalDiscount, grandTotal, workId])
  }

  // Tested
  async getWorkTypes() {
    var query = 'SELECT IdTipoTrabajo, Descripcion FROM TipoTrabajos'
    return this.allAsync(query, [])
  }

  async getWorkType(idWorkType) {
    var query = 'SELECT Descripcion FROM TipoTrabajos WHERE IdTipoTrabajo = ?'
    return this.allAsync(query, [idWorkType])
  }

  cleanWorkFromView(work) {
    let returnedValue = this.iterationCopy(work)
    returnedValue.PrecioSinDescuento = returnedValue.SumaPrecioSinDescuento
    delete returnedValue.SumaPrecioSinDescuento

    returnedValue.PrecioConDescuento = returnedValue.SumaPrecioConDescuento
    delete returnedValue.SumaPrecioConDescuento

    delete returnedValue.SumaAditamentos
    delete returnedValue.SumaCeramica
    delete returnedValue.SumaResina
    delete returnedValue.SumaOrtodoncia
    delete returnedValue.SumaEsqueletico
    delete returnedValue.SumaZirconio
    delete returnedValue.SumaFija
    delete returnedValue.SumaTotalMetal
    delete returnedValue.Chequeado

    return returnedValue
  }
}