'use strict'

var sqlite3 = require('sqlite3').verbose()
var db

import _ from 'lodash'

function createTable () {
  db.run('CREATE TABLE TipoTrabajos (' +
  '    IdTipoTrabajo INTEGER PRIMARY KEY AUTOINCREMENT,' +
  '    Descripcion   TEXTO   NOT NULL);', insertValueObjects)
}

function insertValueObjects () {
  var batch = db.prepare('INSERT INTO TipoTrabajos (IdTipoTrabajo, Descripcion) VALUES (?, ?)')
  batch.run(1, 'Fija')
  batch.run(2, 'Resina')
  batch.run(3, 'Ortodoncia')
  batch.run(4, 'Esquelético')
  batch.run(5, 'Zirconio')
  batch.run(6, 'Compostura')
  batch.run(7, 'Implante')
  batch.finalize()
  db.close()
}

export function createNewDatabase (fileName) {
  db = new sqlite3.Database(fileName, createTable)
}

// Works ----------------------------------------------------------------------

//Tested
export function getWorksList (fileName, customFilters) {
  db = new sqlite3.Database(fileName)
  var query = 'SELECT * FROM vTrabajos WHERE 1=1'
  debugger
  if (customFilters !== undefined){
    if (customFilters.fEntrada !== undefined){
      query += processDateQuery('FechaEntrada', customFilters.fEntrada)
    }
    if (customFilters.fPrevista !== undefined){
      query += processDateQuery('FechaPrevista', customFilters.fPrevista)
    }
    if (customFilters.fSalida !== undefined){
      query += processDateQuery('FechaTerminacion', customFilters.fSalida)
    }
    if (customFilters.tipo !== undefined && customFilters.tipo.length > 0){
      query += processTypeQuery('TipoTrabajo', customFilters.tipo)
    }
  }

  return allAsync(db, query, []).then((row) => {
    // db.close()
    return row
  })
}

function processTypeQuery(field, values){
  var returnedValue = ` AND ${field} IN (`
  _.forEach(values, (value) => returnedValue += `"${value}",`)

  return returnedValue.substring(0, returnedValue.length - 1) + ')'
}

function processDateQuery(field, value){
  switch(value){
    case 'Hoy':
      return ` AND ${field} >= date("now","localtime") AND ${field} < date("now", "localtime", "+1 day")`
    case 'Esta semana':
      return ` AND (${field} BETWEEN date('now', 'weekday 1', '-7 day') AND date('now', 'weekday 1', '-1 day'))`
    case 'Últimos 7 días':
      return ` AND ${field} >= date("now", "localtime", "-7 day")`
    case 'Últimos 15 días':
    return ` AND ${field} >= date("now", "localtime", "-15 day")`
    case 'Últimos 30 días':
    return ` AND ${field} >= date("now", "localtime", "-30 day")`
    case 'Este mes':
      return ` AND ${field} >= date("now", "localtime", "start of month")
      AND ${field} <= date("now", "localtime", "start of month", "+1 month", "-1 day")`
    case 'Ninguna':
      return ` AND ${field} is null`
    case 'Ninguna o en el futuro':
      return ` AND (${field} is null OR ${field} > date("now", "localtime"))`
    default:
      throw 'Not recognized the WHERE parameter ' + value
  }
}

//Tested
export function getWork (workId, fileName) {
  db = new sqlite3.Database(fileName)
  var query = 'SELECT t.IdTrabajo, tt.Descripcion AS TipoTrabajo, t.IdDentista, d.NombreClinica, d.NombreDentista, ' +
  't.IdTipoTrabajo, t.Paciente, t.Color, date(t.FechaTerminacion) AS FechaTerminacion, date(t.FechaEntrada) as FechaEntrada, date(t.FechaPrevista) as FechaPrevista, ' +
  't.PrecioFinal, t.PrecioMetal, t.Nombre ' +
  'FROM Trabajos t ' +
  'INNER JOIN Dentistas d ON d.IdDentista = t.IdDentista ' +
  'INNER JOIN TipoTrabajos tt ON tt.IdTipoTrabajo = t.IdTipoTrabajo ' +
  'WHERE t.IdTrabajo = ?'
  return getAsync(db, query, [workId]).then((row) => {
    // db.close()
    return row
  })
}

export function insertWork(work, fileName) {
  db = new sqlite3.Database(fileName)
  var query = ''
  // return run(db, query, [workIndication.IdTrabajo,
  //   workIndication.Descripcion , workIndication.Precio])
  }

// Work Indications------------------------------------------------------------

//Tested
export function getWorkIndications (workId, fileName) {
  db = new sqlite3.Database(fileName)
  var query = 'SELECT IdTrabajoDetalle, Descripcion, Precio ' +
  'FROM TrabajosDetalle ' +
  'WHERE IdTrabajo = ?'
  return allAsync(db, query, [workId]).then((rows) => {
    return rows
  })
}

export function insertWorkIndications(workIndication, fileName) {
  db = new sqlite3.Database(fileName)
  var query = 'INSERT INTO TrabajosDetalle (IdTrabajo, ' +
  'Descripcion, Precio) ' +
  'VALUES (?, ?, ?)'
  return run(db, query, [workIndication.IdTrabajo,
    workIndication.Descripcion , workIndication.Precio])
  }

  export function updateWorkIdications(workIndication, fileName) {
    db = new sqlite3.Database(fileName)
    var query = 'UPDATE TrabajosDetalle ' +
    'SET IdTrabajo = ?, Descripcion = ?, Precio = ? ' +
    'WHERE IdTrabajoDetalle = ?'
    return run(db, query, [workIndication.IdTrabajo, workIndication.Descripcion, workIndication.Precio, workIndication.IdTrabajoDetalle])
  }

export function deleteWorkIndications(workIndicationId, fileName){
  db = new sqlite3.Database(fileName)
  var query = 'DELETE FROM TrabajosDetalle WHERE IdTrabajoDetalle = ?'
  return run(db, query, [workIndicationId])
}

// Work Tests------------------------------------------------------------------

//Tested
export function getWorkTestsList (workId, fileName) {
  db = new sqlite3.Database(fileName)
  var query = 'SELECT p.IdPrueba, p.Descripcion, p.FechaSalida, ' +
  'p.FechaEntrada, p.Comentario, t1.Descripcion As TurnoEntrada, ' +
  't2.Descripcion AS TurnoSalida ' +
  'FROM Pruebas p ' +
  'LEFT JOIN Turnos t1 ON p.IdTurnoFechaEntrada = t1.IdTurno ' +
  'LEFT JOIN Turnos t2 ON p.IdTurnoFechaSalida = t2.IdTurno ' +
  'WHERE IdTrabajo = ?'
  return allAsync(db, query, [workId]).then((rows) => {
    return rows
  })
}

export function insertWorkTest(workTest, fileName) {
  db = new sqlite3.Database(fileName)
  var query = 'INSERT INTO Pruebas (IdTrabajo, Descripcion, FechaSalida, ' +
  'FechaEntrada, Comentario, IdTurnoFechaSalida, IdTurnoFechaEntrada) ' +
  'VALUES (?, ?, ?, ?, ?, ?, ?)'
  return run(db, query, [workTest.IdTrabajo, workTest.Descripcion, workTest.FechaSalida,
    workTest.FechaEntrada, workTest.Comentario, workTest.IdTurnoFechaSalida,
    workTest.IdTurnoFechaEntrada])
}

export function updateWorkTest(workTest, fileName) {
  db = new sqlite3.Database(fileName)
  var query = 'UPDATE Pruebas SET IdTrabajo = ?, Descripcion = ?, FechaSalida = ?, ' +
    'FechaEntrada = ?, Comentario = ?, IdTurnoFechaSalida = ?, ' +
    'IdTurnoFechaEntrada = ? ' +
    'WHERE IdPrueba = ?'
    return run(db, query, [workTest.IdTrabajo, workTest.Descripcion, workTest.FechaSalida,
      workTest.FechaEntrada, workTest.Comentario, workTest.IdTurnoFechaSalida,
      workTest.IdTurnoFechaEntrada, workTest.IdPrueba])
}

export function deleteWorkTest(workTestId, fileName){
  db = new sqlite3.Database(fileName)
  var query = 'DELETE FROM Pruebas WHERE IdPrueba = ?'
  return run(db, query, [workTestId])
}

// Custom queries for Work (KPIs)----------------------------------------------

//Tested
export function getInboundWorksToday(fileName) {
  db = new sqlite3.Database(fileName)
  var query = 'SELECT COUNT(1) AS Count FROM Trabajos ' +
  'WHERE FechaEntrada >= date("now","localtime") AND FechaEntrada < date("now", "localtime", "+1 day")'
  return getAsync(db, query, []).then((row) => {
    return row
  })
}

//Tested
export function getWorkInExecution (fileName) {
  db = new sqlite3.Database(fileName)
  var query = 'SELECT COUNT(1) AS Count ' +
  'FROM Trabajos ' +
  'WHERE FechaTerminacion is NULL OR FechaTerminacion >= date("now", "localtime")'
  return getAsync(db, query, []).then((row) => {
    // db.close()
    return row
  })
}

//Tested
export function getWorksEndedThisMonth(fileName) {
db = new sqlite3.Database(fileName)
var query = 'SELECT COUNT(1) AS Count ' +
'FROM Trabajos t ' +
'WHERE FechaTerminacion >= date("now", "localtime", "start of month") ' +
'AND FechaTerminacion <= date("now", "localtime", "start of month", "+1 month", "-1 day")'
return getAsync(db, query, []).then((row) => {
  // db.close()
  return row
})
}

//Tested
export function getWorksEndedLast30days(fileName) {
  db = new sqlite3.Database(fileName)
  var query = 'SELECT COUNT(1) AS Count, SUM(PrecioFinal) AS Sum ' +
  'FROM Trabajos ' +
  'WHERE FechaTerminacion >= date("now", "localtime", "-30 days")'
  return getAsync(db, query, []).then((row) => {
    // db.close()
    return row
  })
  }

  //Tested
  export function getWorksEndedPrevious30days(fileName) {
    db = new sqlite3.Database(fileName)
    var query = 'SELECT COUNT(1) AS Count, SUM(PrecioFinal) AS Sum ' +
  'FROM Trabajos ' +
    'WHERE FechaTerminacion >= date("now", "localtime", "-60 days") '+
    'AND FechaTerminacion <= date("now", "localtime", "-30 days")'
    return getAsync(db, query, []).then((row) => {
      // db.close()
      return row
    })
    }


// Work Types -----------------------------------------------------------------

//Tested
export function getWorkTypes (fileName) {
  db = new sqlite3.Database(fileName)
  var query = 'SELECT IdTipoTrabajo, Descripcion FROM TipoTrabajos'

  return allAsync(db, query, []).then((row) => {
    // db.close()
    return row
  })
}

// Adjuncts -------------------------------------------------------------------

export function getAdjuntsOfWork (workId, fileName) {
  db = new sqlite3.Database(fileName)
  var query = 'SELECT IdAditamento, Caja, Cubeta, Articulador, ' +
  'Pletinas, Tornillos, Analogos, PosteImpresion, ' +
  'Interface, Otros ' +
  'FROM Aditamentos' +
  'WHERE IdTrabajo = ?'

  return allAsync(db, query, [workId]).then((row) => {
    // db.close()
    return row
  })
}

export function insertAdjuntsOfWork(adjunt, fileName) {
  db = new sqlite3.Database(fileName)
  var query = 'INSERT INTO Aditamentos ( ' +
  'IdTrabajo, Caja, Cubeta, Articulador, ' +
  'Pletinas, Tornillos, Analogos, PosteImpresion, ' +
  'Interface, Otros) ' +
  'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'

  return run(db, query, [adjunt.IdTrabajo, adjunt.Caja, adjunt.Cubeta, adjunt.Articulador,
    adjunt.Pletinas, adjunt.Tornillos, adjunt.Analogos, adjunt.PosteImpresion,
    adjunt.Interface, adjunt.Otros])
}

export function updateAdjuntsOfWork(adjunt, fileName) {
  db = new sqlite3.Database(fileName)
  var query = 'UPDATE Aditamentos ' +
    'SET IdTrabajo = ?, Caja = ?, Cubeta = ?, ' +
    'Articulador = ?, Pletinas = ?, Tornillos = ?,' +
    'Analogos = ?, PosteImpresion = ?, Interface = ?,' +
    'Otros = ? ' +
    'WHERE IdAditamento = ?'
  return run(db, query, [adjunt.IdTrabajo, adjunt.Caja, adjunt.Cubeta, adjunt.Articulador,
      adjunt.Pletinas, adjunt.Tornillos, adjunt.Analogos, adjunt.PosteImpresion,
      adjunt.Interface, adjunt.Otros, adjunt.IdAditamento])
}

export function deleteAdjuntsOfWork(adjuntId, fileName){
  db = new sqlite3.Database(fileName)
  var query = 'DELETE FROM Aditamentos WHERE IdAditamento = ?'
  return run(db, query, [adjuntId])
}

// Dentists -------------------------------------------------------------------

//Tested
export function getDentistList (fileName) {
  db = new sqlite3.Database(fileName)
  var query = 'SELECT IdDentista AS Key, IdDentista, NombreDentista, NombreClinica, ' +
  'DatosFiscales, DatosBancarios, DatosInteres, ' +
  'Direccion, CP, Poblacion, CorreoElectronico, ' +
  'Telefono, Telefono2 ' +
  'FROM Dentistas'
  return allAsync(db, query, []).then((row) => {
    db.close()
    return row
  })
}

//Tested
export function getDentist (dentistId, fileName) {
  db = new sqlite3.Database(fileName)
  var query = 'SELECT IdDentista, NombreDentista, NombreClinica, ' +
  'DatosFiscales, Direccion, DatosBancarios, DatosInteres, CorreoElectronico, ' +
  'CP, Poblacion, Telefono, Telefono2 FROM Dentistas WHERE IdDentista = ?'
  return getAsync(db, query, [dentistId]).then((row) => {
    db.close()
    return row
  })
}

//Tested
export function insertDentist(dentist, fileName) {
  db = new sqlite3.Database(fileName)
  var query = 'INSERT INTO Dentistas (NombreDentista, NombreClinica, ' +
    'DatosFiscales, Direccion, DatosBancarios, DatosInteres, ' +
    'CorreoElectronico, CP, Poblacion, Telefono, Telefono2) ' +
    'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
  runAsync(db, query, [dentist.NombreDentista, dentist.NombreClinica, dentist.DatosFiscales,
    dentist.Direccion, dentist.DatosBancarios, dentist.DatosInteres,
    dentist.CorreoElectronico, dentist.CP, dentist.Poblacion,
    dentist.Telefono, dentist.Telefono2])
}

//Tested
export function updateDentist(dentist, fileName) {
  db = new sqlite3.Database(fileName)
  var query = 'UPDATE Dentistas ' +
    'SET NombreDentista = ?, NombreClinica = ?, ' +
    'DatosFiscales = ?, Direccion = ?, DatosBancarios = ?, ' +
    'DatosInteres = ?, CorreoElectronico = ?, CP = ?, ' +
    'Poblacion = ?, Telefono = ?, Telefono2 = ? ' +
    'WHERE IdDentista = ? '
  runAsync(db, query, [dentist.NombreDentista, dentist.NombreClinica,
    dentist.DatosFiscales, dentist.Direccion, dentist.DatosBancarios, dentist.DatosInteres, dentist.CorreoElectronico, dentist.CP, dentist.Poblacion, dentist.Telefono, dentist.Telefono2,
    dentist.IdDentista])
}

export function deleteDentist(dentistId, fileName){
  db = new sqlite3.Database(fileName)
  var query = 'DELETE FROM Dentistas WHERE IdDentista = ?'
  return run(db, query, [dentistId])
}

//Tested
export function searchDentistsByName (dentistName, fileName) {
  db = new sqlite3.Database(fileName)
  var query = 'SELECT IdDentista, NombreDentista, NombreClinica, ' +
  'DatosFiscales, Direccion, DatosBancarios, DatosInteres, CorreoElectronico, ' +
  'CP, Poblacion, Telefono, Telefono2 FROM Dentistas WHERE NombreDentista LIKE ?'
  return allAsync(db, query, ['%' + dentistName + '%']).then((rows) => {
    return rows
  })
}

// Generic functions ----------------------------------------------------------

function getAsync (db, sql, params) {
  return new Promise(function (resolve, reject) {
    db.get(sql, params, function (err, row) {
      if (err) {
        reject(err)
      } else {
        resolve(row)
      }
    })
  })
}

function allAsync (db, sql, params) {
  return new Promise(function (resolve, reject) {
    db.all(sql, params, function (err, row) {
      if (err) {
        reject(err)
      } else {
        resolve(row)
      }
    })
  })
}

function runAsync (db, sql, params) {
  return new Promise(function (resolve, reject) {
    db.run(sql, params, function (err, row) {
      if (err) {
        reject(err)
      } else {
        resolve(row)
      }
    })
  })
}
