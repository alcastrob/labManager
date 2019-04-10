// eslint-disable-next-line no-unused-expressions
'use strict'

import PersistenceService from './PersistenceService'

export default class CatalogService extends PersistenceService {
  // Tested
  async getCatalogList(customFilters) {
    var query = 'SELECT * FROM vCatalogo WHERE 1=1'
    if (customFilters !== undefined) {
      query += ` AND Descripcion LIKE "%${customFilters}%"`
    }
    return this.allAsync(query, [])
  }

  // Tested
  async insertCatalogEntry(catalogEntry) {
    var query = 'INSERT INTO Catalogo (Descripcion, Precio, FechaInicio, FechaFin, Activo) ' +
      'VALUES (?, ?, date("now", "localtime"), NULL, true)'
    return this.runAsync(query, [catalogEntry.Descripcion, catalogEntry.Precio])
  }

  // Tested
  async updateCatalogEntry(catalogEntry) {
    this.deleteCatalogEntry(catalogEntry)
    this.insertCatalogEntry(catalogEntry)
  }

  // Tested
  async deleteCatalogEntry(catalogEntry) {
    var query = 'UPDATE Catalogo SET FechaFin = date("now", "localtime"), Activo = false ' +
      'WHERE IdElementoCatalogo = ?'
    return this.runAsync(query, [catalogEntry.IdElementoCatalogo])
  }
}