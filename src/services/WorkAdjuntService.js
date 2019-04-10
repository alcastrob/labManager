// eslint-disable-next-line no-unused-expressions
'use strict'

import PersistenceService from './PersistenceService'

export default class WorkAdjuntService extends PersistenceService {
  // Tested
  async getAdjuntsOfWork(workId) {
    var query = 'SELECT IdAditamento, Caja, Cubeta, Articulador, ' +
      'Pletinas, Tornillos, Analogos, PosteImpresion, ' +
      'Interface, Otros ' +
      'FROM Aditamentos ' +
      'WHERE IdTrabajo = ?'

    return this.getAsync(query, [workId])
  }

  // Tested
  async insertAdjuntsOfWork(adjunt) {
    var query = 'INSERT INTO Aditamentos ( ' +
      'IdTrabajo, Caja, Cubeta, Articulador, ' +
      'Pletinas, Tornillos, Analogos, PosteImpresion, ' +
      'Interface, Otros) ' +
      'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'

    return this.runAsync(query, [adjunt.IdTrabajo, adjunt.Caja, adjunt.Cubeta, adjunt.Articulador,
      adjunt.Pletinas, adjunt.Tornillos, adjunt.Analogos, adjunt.PosteImpresion,
      adjunt.Interface, adjunt.Otros
    ])
  }

  // Tested
  async updateAdjuntsOfWork(adjunt) {
    var query = 'UPDATE Aditamentos ' +
      'SET Caja = ?, Cubeta = ?, ' +
      'Articulador = ?, Pletinas = ?, Tornillos = ?,' +
      'Analogos = ?, PosteImpresion = ?, Interface = ?,' +
      'Otros = ? ' +
      'WHERE IdTrabajo = ?'
    return this.runAsync(query, [adjunt.Caja, adjunt.Cubeta, adjunt.Articulador,
      adjunt.Pletinas, adjunt.Tornillos, adjunt.Analogos, adjunt.PosteImpresion,
      adjunt.Interface, adjunt.Otros, adjunt.IdTrabajo
    ])
  }
}