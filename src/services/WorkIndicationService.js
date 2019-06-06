'use strict'

import log from 'loglevel'
import PersistenceService from './PersistenceService'

export default class WorkService extends PersistenceService {
  // Tested
  async getWorkIndications(workId) {
    var query = 'SELECT IdTrabajoDetalle, IdTrabajo, Descripcion, Precio, Cantidad, Notas, Subtotal, IdElementoCatalogo ' +
      'FROM TrabajosDetalle ' +
      'WHERE IdTrabajo = ?'
    return this.allAsync(query, [workId])
  }

  // Tested
  async insertWorkIndications(workIndication) {
    var query = 'INSERT INTO TrabajosDetalle (IdTrabajo, ' +
      'Descripcion, Precio, Cantidad, Notas, Subtotal, IdElementoCatalogo) ' +
      'VALUES (?, ?, ?, ?, ?, ?, ?)'
    log.info(`Creating the work indication for work ${workIndication.IdTrabajo}`)
    return this.runAsync(query, [workIndication.IdTrabajo,
      workIndication.Descripcion, workIndication.Precio, workIndication.Cantidad, workIndication.Notas, workIndication.Subtotal, workIndication.IdElementoCatalogo
    ])
  }

  async updateWorkIndications(workIndication) {
    var query = 'UPDATE TrabajosDetalle ' +
      'SET Descripcion = ?, Precio = ?, ' +
      'Cantidad = ?, Notas = ?, ' +
      'Subtotal = ?, IdElementoCatalogo = ? ' +
      'WHERE IdTrabajoDetalle = ?'
    log.info(`Updating the work indication ${workIndication.IdTrabajoDetalle} for work ${workIndication.IdTrabajo}`)
    return this.runAsync(query, [workIndication.Descripcion, workIndication.Precio, workIndication.Cantidad, workIndication.Notas, workIndication.Subtotal, workIndication.IdElementoCatalogo, workIndication.IdTrabajoDetalle])
  }

  // Tested
  async deleteWorkIndications(workIndication) {
    var query = 'DELETE FROM TrabajosDetalle WHERE IdTrabajoDetalle = ?'
    log.info(`Deleting the work indication ${workIndication.IdTrabajoDetalle} for work ${workIndication.IdTrabajo}`)
    return this.runAsync(query, [workIndication.IdTrabajoDetalle])
  }

}