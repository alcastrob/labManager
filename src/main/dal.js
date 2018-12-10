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

// export function getWorkDetails (workId, fileName) {
//   db = new sqlite3.Database(fileName)
//   var returnedValue = ''
//   var query = 'SELECT IdTrabajo, IdDentista, IdTipoTrabajo, Paciente, ' +
//   'Color, FechaTerminacion, FechaEntrada, FechaPrevista, PrecioFinal, ' +
//   'PrecioMetal, PrecioTotal, PrecioFija, Nombre FROM Trabajos WHERE IdTrabajo = ?'
//   // debugger
//   db.get(query, [ workId ], (err, row) => {
//     if (err) {
//       throw err
//     }
//     returnedValue = Object.assign({}, row)
//   })
//   db.close()
//   return returnedValue
// }

export function getWorkDetails (workId, fileName) {
  db = new sqlite3.Database(fileName)
  var query = 'SELECT IdTrabajo, IdDentista, IdTipoTrabajo, Paciente, ' +
  'Color, FechaTerminacion, FechaEntrada, FechaPrevista, PrecioFinal, ' +
  'PrecioMetal, PrecioTotal, PrecioFija, Nombre FROM Trabajos WHERE IdTrabajo = ?'
  getAsync(db, query, [workId]).then((row) => {
    db.close()
    // console.log(row)
    return row
  })
  return {idTrabajo: workId}
}

export function getDentistDetails (dentistId, fileName) {
  db = new sqlite3.Database(fileName)
  var query = 'SELECT IdDentista, NombreDentista, NombreClinica, ' +
  'DatosFiscales, Direccion, DatosBancarios, DatosInteres, CorreoElectronico, ' +
  'CP, Poblacion, Telefono, Telefono2 FROM Dentistas WHERE IdDentista = ?'
  getAsync(db, query, [dentistId]).then((row) => {
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
};
