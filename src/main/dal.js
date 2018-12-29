'use strict'

var sqlite3 = require('sqlite3').verbose()
var db

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
export function getWorksList (fileName) {
  db = new sqlite3.Database(fileName)
  var query = 'SELECT t.IdTrabajo AS Key, t.IdTrabajo, d.NombreDentista, tt.Descripcion AS TipoTrabajo, ' +
  't.Paciente, t.Color, t.FechaEntrada, t.FechaPrevista, t.FechaTerminacion, ' +
  't.PrecioFinal AS Precio ' +
  'FROM Trabajos t ' +
  'INNER JOIN Dentistas d ON d.IdDentista = t.IdDentista ' +
  'INNER JOIN TipoTrabajos tt ON tt.IdTipoTrabajo = t.IdTipoTrabajo'
  return allAsync(db, query, []).then((row) => {
    // db.close()
    return row
  })
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
  // return runAsync(db, query, [workIndication.IdTrabajo,
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

//Tested
export function insertWorkIndications(workIndication, fileName) {
  debugger
  db = new sqlite3.Database(fileName)
  var query = 'INSERT INTO TrabajosDetalle (IdTrabajo, ' +
  'Descripcion, Precio) ' +
  'VALUES (?, ?, ?)'
  return runAsync(db, query, [workIndication.IdTrabajo,
    workIndication.Descripcion , workIndication.Precio])
  }

//Tested
export function updateWorkIndications(workIndication, fileName) {
  debugger
  db = new sqlite3.Database(fileName)
  var query = 'UPDATE TrabajosDetalle ' +
  'SET Descripcion = ?, Precio = ? ' +
  'WHERE IdTrabajoDetalle = ?'
  return runAsync(db, query, [workIndication.Descripcion, workIndication.Precio, workIndication.IdTrabajoDetalle])
}

//Tested
export function deleteWorkIndications(workIndication, fileName){
  debugger
  db = new sqlite3.Database(fileName)
  var query = 'DELETE FROM TrabajosDetalle WHERE IdTrabajoDetalle = ?'
  return runAsync(db, query, [workIndication.IdTrabajoDetalle])
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
  return runAsync(db, query, [workTest.IdTrabajo, workTest.Descripcion, workTest.FechaSalida,
    workTest.FechaEntrada, workTest.Comentario, workTest.IdTurnoFechaSalida,
    workTest.IdTurnoFechaEntrada])
}

export function updateWorkTest(workTest, fileName) {
  db = new sqlite3.Database(fileName)
  var query = 'UPDATE Pruebas SET IdTrabajo = ?, Descripcion = ?, FechaSalida = ?, ' +
    'FechaEntrada = ?, Comentario = ?, IdTurnoFechaSalida = ?, ' +
    'IdTurnoFechaEntrada = ? ' +
    'WHERE IdPrueba = ?'
    return runAsync(db, query, [workTest.IdTrabajo, workTest.Descripcion, workTest.FechaSalida,
      workTest.FechaEntrada, workTest.Comentario, workTest.IdTurnoFechaSalida,
      workTest.IdTurnoFechaEntrada, workTest.IdPrueba])
}

export function deleteWorkTest(workTestId, fileName){
  db = new sqlite3.Database(fileName)
  var query = 'DELETE FROM Pruebas WHERE IdPrueba = ?'
  return runAsync(db, query, [workTestId])
}

// Custom queries for Work (KPIs)----------------------------------------------

//Tested
export function getWorkInExecution (fileName) {
  db = new sqlite3.Database(fileName)
  var query = 'SELECT t.IdTrabajo AS Key, t.IdTrabajo, d.NombreDentista, tt.Descripcion AS TipoTrabajo, ' +
  't.Paciente, t.Color, t.FechaEntrada, t.FechaPrevista, t.FechaTerminacion, ' +
  't.PrecioFinal AS Precio ' +
  'FROM Trabajos t ' +
  'INNER JOIN Dentistas d ON d.IdDentista = t.IdDentista ' +
  'INNER JOIN TipoTrabajos tt ON tt.IdTipoTrabajo = t.IdTipoTrabajo ' +
  'WHERE FechaTerminacion is NULL'
  return allAsync(db, query, []).then((row) => {
    // db.close()
    return row
  })
}

//Tested
export function getWorksEndedThisMonth(fileName) {
db = new sqlite3.Database(fileName)
var query = 'SELECT t.IdTrabajo AS Key, t.IdTrabajo, d.NombreDentista, tt.Descripcion AS TipoTrabajo, ' +
't.Paciente, t.Color, t.FechaEntrada, t.FechaPrevista, t.FechaTerminacion, ' +
't.PrecioFinal AS Precio ' +
'FROM Trabajos t ' +
'INNER JOIN Dentistas d ON d.IdDentista = t.IdDentista ' +
'INNER JOIN TipoTrabajos tt ON tt.IdTipoTrabajo = t.IdTipoTrabajo ' +
'WHERE FechaTerminacion >= date("now","localtime", "start of month") ' +
'AND FechaTerminacion <= date("now","localtime", "start of month","+1 month","-1 day")'
return allAsync(db, query, []).then((row) => {
  // db.close()
  return row
})
}

//Tested
export function getWorksEndedLast30days(fileName) {
  db = new sqlite3.Database(fileName)
  var query = 'SELECT t.IdTrabajo AS Key, t.IdTrabajo, d.NombreDentista, tt.Descripcion AS TipoTrabajo, ' +
  't.Paciente, t.Color, t.FechaEntrada, t.FechaPrevista, t.FechaTerminacion, ' +
  't.PrecioFinal AS Precio ' +
  'FROM Trabajos t ' +
  'INNER JOIN Dentistas d ON d.IdDentista = t.IdDentista ' +
  'INNER JOIN TipoTrabajos tt ON tt.IdTipoTrabajo = t.IdTipoTrabajo ' +
  'WHERE FechaTerminacion >= date("now","localtime", "-30 days")'
  return allAsync(db, query, []).then((row) => {
    // db.close()
    return row
  })
  }

  //Tested
  export function getWorksEndedPrevious30days(fileName) {
    db = new sqlite3.Database(fileName)
    var query = 'SELECT t.IdTrabajo AS Key, t.IdTrabajo, d.NombreDentista, tt.Descripcion AS TipoTrabajo, ' +
    't.Paciente, t.Color, t.FechaEntrada, t.FechaPrevista, t.FechaTerminacion, ' +
    't.PrecioFinal AS Precio ' +
    'FROM Trabajos t ' +
    'INNER JOIN Dentistas d ON d.IdDentista = t.IdDentista ' +
    'INNER JOIN TipoTrabajos tt ON tt.IdTipoTrabajo = t.IdTipoTrabajo ' +
    'WHERE FechaTerminacion >= date("now","localtime", "-60 days") '+
    'AND FechaTerminacion <= date("now","localtime", "-30 days")'
    return allAsync(db, query, []).then((row) => {
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

  return runAsync(db, query, [adjunt.IdTrabajo, adjunt.Caja, adjunt.Cubeta, adjunt.Articulador,
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
  return runAsync(db, query, [adjunt.IdTrabajo, adjunt.Caja, adjunt.Cubeta, adjunt.Articulador,
      adjunt.Pletinas, adjunt.Tornillos, adjunt.Analogos, adjunt.PosteImpresion,
      adjunt.Interface, adjunt.Otros, adjunt.IdAditamento])
}

export function deleteAdjuntsOfWork(adjuntId, fileName){
  db = new sqlite3.Database(fileName)
  var query = 'DELETE FROM Aditamentos WHERE IdAditamento = ?'
  return runAsync(db, query, [adjuntId])
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
  return runAsync(db, query, [dentistId])
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
