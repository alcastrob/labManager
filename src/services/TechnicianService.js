// eslint-disable-next-line no-unused-expressions
'use strict'

import PersistenceService from './PersistenceService'

export default class TechnicianService extends PersistenceService {
  // Tested
  async getTechniciansList(customFilters) {
    var query = 'SELECT * FROM Tecnicos WHERE Activo=true'
    if (customFilters !== undefined) {
      query += ` AND (Nombre LIKE "%${customFilters}%" OR NumColegiado LIKE "%${customFilters}%")`
    }
    return this.allAsync(query, [])
  }

  // Tested
  async insertTechnicianEntry(technician) {
    var query = 'INSERT INTO Tecnicos (Nombre, NumColegiado, FechaInicio, FechaFin, Activo) ' +
      'VALUES (?, ?, date("now", "localtime"), NULL, true)'
    return this.runAsync(query, [technician.Nombre, technician.NumColegiado])
  }

  // Tested
  async updateTechnicianEntry(technician) {
    var query = 'UPDATE Tecnicos SET Nombre=?, NumColegiado=? ' +
      'WHERE IdTecnico = ?'
      return this.runAsync(query, [technician.Nombre, technician.NumColegiado, technician.IdTecnico])
  }

  // Tested
  async deleteTechnicianEntry(technician) {
    var query = 'UPDATE Tecnicos SET FechaFin = date("now", "localtime"), Activo = false ' +
      'WHERE IdTecnico = ?'
    return this.runAsync(query, [technician.IdTecnico])
  }
}