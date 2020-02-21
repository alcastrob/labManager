// eslint-disable-next-line no-unused-expressions
'use strict'

import PersistenceService from './PersistenceService'
import log from 'loglevel'

export default class DentistService extends PersistenceService {
  // Tested
  async getDentistList() {
    var query = 'SELECT * FROM vDentistas'
    return this.allAsync(query, [])
  }

  // Tested
  async getDentist(dentistId) {
    var query = 'SELECT * FROM vDentistas WHERE IdDentista = ?'
    return this.getAsync(query, [dentistId])
  }

  // Tested
  async insertDentist(dentist) {
    var query = 'INSERT INTO Dentistas (NombreDentista, NombreClinica, ' +
      'DatosFiscales, Direccion, DatosBancarios, DatosInteres, ' +
      'CorreoElectronico, CP, Poblacion, Telefono, Telefono2) ' +
      'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
    var id = await this.runAsync(query, [dentist.NombreDentista, dentist.NombreClinica, dentist.DatosFiscales,
      dentist.Direccion, dentist.DatosBancarios, dentist.DatosInteres,
      dentist.CorreoElectronico, dentist.CP, dentist.Poblacion,
      dentist.Telefono, dentist.Telefono2
    ])
    log.info(`Created the dentist ${id} - ${dentist.NombreDentista}`)
  }

  // Tested
  async updateDentist(dentist) {
    var query = 'UPDATE Dentistas ' +
      'SET NombreDentista = ?, NombreClinica = ?, ' +
      'DatosFiscales = ?, Direccion = ?, DatosBancarios = ?, ' +
      'DatosInteres = ?, CorreoElectronico = ?, CP = ?, ' +
      'Poblacion = ?, Telefono = ?, Telefono2 = ? ' +
      'WHERE IdDentista = ? '
    this.runAsync(query, [dentist.NombreDentista, dentist.NombreClinica,
      dentist.DatosFiscales, dentist.Direccion, dentist.DatosBancarios, dentist.DatosInteres, dentist.CorreoElectronico, dentist.CP, dentist.Poblacion, dentist.Telefono, dentist.Telefono2,
      dentist.IdDentista
    ])
  }

  // Tested
  async searchDentistsByName(dentistName) {
    var query = 'SELECT IdDentista, NombreDentista, NombreClinica, ' +
      'DatosFiscales, Direccion, DatosBancarios, DatosInteres, CorreoElectronico, ' +
      'CP, Poblacion, Telefono, Telefono2 FROM Dentistas WHERE NombreDentista LIKE ?'
    return this.allAsync(query, ['%' + dentistName + '%'])
  }

  // Tested
  async searchDentistByExactName(dentistName) {
    var query = 'SELECT IdDentista, NombreDentista, NombreClinica, ' +
      'DatosFiscales, Direccion, DatosBancarios, DatosInteres, CorreoElectronico, ' +
      'CP, Poblacion, Telefono, Telefono2 FROM Dentistas WHERE NombreDentista = ?'
    return this.allAsync(query, [dentistName])
  }
}