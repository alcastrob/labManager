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

export function getWorkDetails (workId, fileName) {
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

export function getWorkIndications (workId, fileName) {
  db = new sqlite3.Database(fileName)
  var query = 'SELECT IdTrabajoDetalle, Descripcion, Precio ' +
  'FROM TrabajosDetalle ' +
  'WHERE IdTrabajo = ?'
  return allAsync(db, query, [workId]).then((rows) => {
    return rows
  })
}

export function getWorkTests (workId, fileName) {
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

// Custom queries for Work (KPIs)----------------------------------------------

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

export function getWorkTypes (fileName) {
  db = new sqlite3.Database(fileName)
  var query = 'SELECT IdTipoTrabajo, Descripcion FROM TipoTrabajos'

  return allAsync(db, query, []).then((row) => {
    // db.close()
    return row
  })
}

// Dentists -------------------------------------------------------------------

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

export function getDentistDetails (dentistId, fileName) {
  db = new sqlite3.Database(fileName)
  var query = 'SELECT IdDentista, NombreDentista, NombreClinica, ' +
  'DatosFiscales, Direccion, DatosBancarios, DatosInteres, CorreoElectronico, ' +
  'CP, Poblacion, Telefono, Telefono2 FROM Dentistas WHERE IdDentista = ?'
  return getAsync(db, query, [dentistId]).then((row) => {
    db.close()
    return row
  })
}

export function searchDentistsByName (dentistName, fileName) {
  db = new sqlite3.Database(fileName)
  var query = ''
  return getAsync(db, query, [dentistName]).then((row) => {
    db.close()
    return row
  })
}

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
