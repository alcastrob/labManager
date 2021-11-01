// eslint-disable-next-line no-unused-expressions
'use strict'

import PersistenceService from './PersistenceService'

export default class PostSalesService extends PersistenceService {
  async getPostSaleList(workId) {
    var query = 'SELECT * FROM PostVentas ' +
      'WHERE IdTrabajo = ?'
    return this.allAsync(query, [workId])
  }

  async insertPostSale(postSales) {
    var query = 'INSERT INTO PostVentas (IdTrabajo, Fecha, Actuación, Firma) ' +
      'VALUES (?, ?, ?, ?)'
    return this.runAsync(query, [postSales.IdTrabajo, postSales.Fecha, postSales.Actuacion,
      postSales.Firma
    ])
  }

  async updatePostSale(postSales) {
    var query = 'UPDATE PostVentas SET IdTrabajo = ?, Fecha = ?, Actuacion = ?, ' +
      'Firma = ?' +
      'WHERE IdPostVenta = ?'
    return this.runAsync(query, [postSales.IdTrabajo, postSales.Fecha, postSales.Actuacion,
      postSales.Firma
    ])
  }

  async deletePostSale(postSales) {
    var query = 'DELETE FROM PostVentas WHERE IdPostVenta = ?'
    return this.runAsync(query, [postSales.IdPostVenta])
  }
}