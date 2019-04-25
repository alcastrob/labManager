// eslint-disable-next-line no-unused-expressions
'use strict'

import PersistenceService from './PersistenceService'

export default class WorkTestService extends PersistenceService {
  // Tested
  async getWorkTestsList(workId) {
    var query = 'SELECT * FROM vPruebas ' +
      'WHERE IdTrabajo = ?'
    return this.allAsync(query, [workId])
  }

  // Tested
  async getDeliveryShifts() {
    var query = 'SELECT IdTurno, Descripcion FROM Turnos'
    return this.allAsync(query, [])
  }

  // Tested
  async insertWorkTest(workTest) {
    var query = 'INSERT INTO Pruebas (IdTrabajo, Descripcion, FechaSalida, ' +
      'FechaEntrada, Comentario, IdTurnoFechaSalida, IdTurnoFechaEntrada) ' +
      'VALUES (?, ?, ?, ?, ?, ?, ?)'
    return this.runAsync(query, [workTest.IdTrabajo, workTest.Descripcion, workTest.FechaSalida,
      workTest.FechaEntrada, workTest.Comentario, workTest.IdTurnoFechaSalida ? workTest.IdTurnoFechaSalida : null,
      workTest.IdTurnoFechaEntrada ? workTest.IdTurnoFechaEntrada : null
    ])
  }

  // Tested
  async updateWorkTest(workTest) {
    var query = 'UPDATE Pruebas SET IdTrabajo = ?, Descripcion = ?, FechaSalida = ?, ' +
      'FechaEntrada = ?, Comentario = ?, IdTurnoFechaSalida = ?, ' +
      'IdTurnoFechaEntrada = ? ' +
      'WHERE IdPrueba = ?'
    return this.runAsync(query, [workTest.IdTrabajo, workTest.Descripcion, workTest.FechaSalida,
      workTest.FechaEntrada, workTest.Comentario, workTest.IdTurnoFechaSalida ? workTest.IdTurnoFechaSalida : null,
      workTest.IdTurnoFechaEntrada ? workTest.IdTurnoFechaEntrada : null, workTest.IdPrueba
    ])
  }

  // Tested
  async deleteWorkTest(workTest) {
    var query = 'DELETE FROM Pruebas WHERE IdPrueba = ?'
    return this.runAsync(query, [workTest.IdPrueba])
  }

  // Tested
  async setInboundWorkTestToToday(workTestId) {
    var query = 'UPDATE Pruebas ' +
      'SET FechaEntrada = date("now", "localtime"), ' +
      'IdTurnoFechaEntrada = 2 - (time("now") BETWEEN time("08:00:00") AND time("17:30:00")) ' +
      'WHERE IdTrabajo = ? AND FechaEntrada IS NULL AND FechaSalida = ' +
      '(SELECT MAX(FechaSalida) FROM Pruebas WHERE IdTrabajo = ?)'
    return this.runAsync(query, [workTestId, workTestId])
  }

  // Tested
  async unsetInboundTestToToday(workTestId) {
    var query = 'UPDATE Pruebas ' +
      'SET FechaEntrada = NULL, ' +
      'IdTurnoFechaEntrada = NULL ' +
      'WHERE IdTrabajo = ? AND date(FechaEntrada, "localtime") = date("now", "localtime") AND FechaSalida = ' +
      '(SELECT MAX(FechaSalida) FROM Pruebas WHERE IdTrabajo = ?)'
    return this.runAsync(query, [workTestId, workTestId])
  }
}