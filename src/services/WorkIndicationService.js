// eslint-disable-next-line no-unused-expressions
'use strict'

import log from 'loglevel'
import PersistenceService from './PersistenceService'

export default class WorkService extends PersistenceService {
  // Tested
  async getWorkIndications(workId) {
    var query = 'SELECT IdTrabajoDetalle, IdTrabajo, Descripcion, Precio ' +
      'FROM TrabajosDetalle ' +
      'WHERE IdTrabajo = ? ' +
      'ORDER BY IdTrabajoDetalle'
    return this.allAsync(query, [workId])
  }

  // Tested
  async insertWorkIndications(workIndication) {
    var query = 'INSERT INTO TrabajosDetalle (IdTrabajo, ' +
      'Descripcion, Precio, Cantidad, Subtotal) ' +
      'VALUES (?, ?, ?, 1, ?)'
    log.info(`Creating the work indication for work ${workIndication.IdTrabajo}`)
    if (workIndication.Precio === undefined || workIndication.Precio === null) {
      throw 'Empty price in INSERT operation'
    }
    return this.runAsync(query, [workIndication.IdTrabajo,
      workIndication.Descripcion, workIndication.Precio, workIndication.Precio
    ])
  }

  // Tested
  async updateWorkIndications(workIndication) {
    var query = 'UPDATE TrabajosDetalle ' +
      'SET Descripcion = ?, Precio = ?, Subtotal = ?, Cantidad = 1 ' +
      'WHERE IdTrabajoDetalle = ?'
    log.info(`Updating the work indication ${workIndication.IdTrabajoDetalle} for work ${workIndication.IdTrabajo}`)
    if (workIndication.Precio === undefined || workIndication.Precio === null) {
      throw 'Empty price in UPDATE operation'
    }
    return this.runAsync(query, [workIndication.Descripcion, workIndication.Precio, workIndication.Precio, workIndication.IdTrabajoDetalle])
  }

  // Tested
  async deleteWorkIndications(workIndication) {
    var query = 'DELETE FROM TrabajosDetalle WHERE IdTrabajoDetalle = ?'
    log.info(`Deleting the work indication ${workIndication.IdTrabajoDetalle} for work ${workIndication.IdTrabajo}`)
    return this.runAsync(query, [workIndication.IdTrabajoDetalle])
  }
}