// eslint-disable-next-line no-unused-expressions
'use strict'

import PersistenceService from './PersistenceService'

export default class ProductBatchService extends PersistenceService {
  // Tested
  async searchProductsByName(productName) {
    var query = 'SELECT IdProductoLote, Descripcion FROM ProductosLotes WHERE Descripcion LIKE ? AND Activo = true'
    return this.allAsync(query, ['%' + productName + '%'])
  }

  // Tested
  async searchProductByExactName(productName) {
    var query = 'SELECT IdProductoLote, Descripcion FROM ProductosLotes WHERE Descripcion = ? AND Activo = true'
    return this.allAsync(query, ['%' + productName + '%'])
  }

  // Tested
  async getProduct(productId) {
    var query = 'SELECT * FROM ProductosLotes WHERE IdProductoLote = ?'
    return this.getAsync(query, [productId])
  }

  // Tested
  async insertProduct(product) {
    var query = 'INSERT INTO ProductosLotes (Descripcion, Activo) VALUES (?, true)'
    return this.runAsync(query, [product.Descripcion])
  }

  async updateProduct(product) {
    var query = 'UPDATE ProductosLotes SET Descripcion = ? ' +
      'WHERE IdProductoLote = ?'
    return this.runAsync(query, [product.Descripcion, product.IdProductoLote])
  }

  // Tested
  async deleteProduct(product) {
    var query = 'UPDATE ProductosLotes SET Activo = false ' +
      'WHERE IdProductoLote = ?'
    return this.runAsync(query, [product.IdProductoLote])
  }

  // Tested
  async getProductList(customFilters) {
    var query = 'SELECT * FROM ProductosLotes WHERE Activo = true '
    if (customFilters !== undefined) {
      query += ` AND Descripcion LIKE "%${customFilters}%" `
    }
    query += 'ORDER BY Descripcion'
    return this.allAsync(query, [])
  }
}