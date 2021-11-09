// eslint-disable-next-line no-unused-expressions
'use strict'

import PersistenceService from './PersistenceService'

export default class PostSalesService extends PersistenceService {
  // Tested
  async getPostSaleList(workId) {
    var query = 'SELECT IdPostVenta, IdTrabajo, date(Fecha) AS Fecha, Actuacion, t.IdTecnico, t.Nombre ' +
    'FROM PostVentas p INNER JOIN Tecnicos t ON p.IdTecnico = t.IdTecnico ' +
    'WHERE IdTrabajo = ?'
    return this.allAsync(query, [workId])
  }

  // Tested
  async insertPostSale(postSales) {
    var query = 'INSERT INTO PostVentas (IdTrabajo, Fecha, Actuacion, IdTecnico) VALUES (?, ?, ?, ?)'
    return this.runAsync(query, [postSales.IdTrabajo, postSales.Fecha, postSales.Actuacion,
      postSales.IdTecnico
    ])
  }

  // Tested
  async updatePostSale(postSales) {
    var query = 'UPDATE PostVentas SET IdTrabajo = ?, Fecha = ?, Actuacion = ?, ' +
      'IdTecnico = ?' +
      'WHERE IdPostVenta = ?'
    return this.runAsync(query, [postSales.IdTrabajo, postSales.Fecha, postSales.Actuacion,
      postSales.IdTecnico, postSales.IdPostVenta
    ])
  }

  // Tested
  async deletePostSale(postSales) {
    var query = 'DELETE FROM PostVentas WHERE IdPostVenta = ?'
    return this.runAsync(query, [postSales.IdPostVenta])
  }
}