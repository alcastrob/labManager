// eslint-disable-next-line no-unused-expressions
'use strict'

import PersistenceService from './PersistenceService'

export default class ConformityDeclarationService extends PersistenceService {
  // Tested
  async getConformityDeclaration(workId) {
    var query1 = 'SELECT * FROM vDeclaracionConformidad WHERE IdTrabajo = ?'
    var query2 = 'SELECT * FROM vDeclaracionProductos ' +
      ' WHERE IdTrabajo = ?'

    return {
      data: await this.getAsync(query1, [workId]),
      details: await this.allAsync(query2, [workId])
    }
  }

  // Tested
  async insertConformityDeclaration(conformity, productIds) {
    var query = 'INSERT INTO DeclaracionConformidad (IdTrabajo, Fecha, Meses, ProductoEspecifico) ' +
      'VALUES (?, ?, ?, ?) '
    return this.runAsync(query, [conformity.IdTrabajo, conformity.Fecha, conformity.Meses, conformity.ProductoEspecifico]).then((conformityId) => {
      return this.insertDeclarationProducts(conformityId, productIds)
    })
  }

  // Tested
  async updateConformityDeclaration(conformity, productsIds) {
    var query = 'UPDATE DeclaracionConformidad SET Fecha = date("now"), Meses = ?, ProductoEspecifico = ? WHERE IdDeclaracion = ?'
    return this.runAsync(query, [conformity.Meses, conformity.ProductoEspecifico, conformity.IdDeclaracion]).then(() => {
      var query2 = 'DELETE FROM DeclaracionProductos WHERE IdDeclaracion = ?'
      return this.runAsync(query2, [conformity.IdDeclaracion]).then(() => {
        return this.insertDeclarationProducts(conformity.IdDeclaracion, productsIds)
      })
    })
  }

  // Tested
  async insertDeclarationProducts(conformityId, productsIds) {
    var promises = []
    for (var productId of productsIds) {
      var query2 = 'INSERT INTO DeclaracionProductos (IdDeclaracion, IdProductoLote) VALUES (?, ?)'
      promises.push(this.runAsync(query2, [conformityId, productId]).then((id) => {
        return id
      }))
    }
    return new Promise(function (resolve) {
      Promise.all(promises).then((rows) => {
        resolve({
          data: rows
        })
      })
    })
  }
}