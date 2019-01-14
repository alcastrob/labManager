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
    if (customFilters.IdDentista !== undefined){
      query += ` AND IdDentista = ${customFilters.IdDentista}`
    }
  }

  return allAsync(db, query, []).then((row) => {
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
      return ` AND (${field} BETWEEN date("now","localtime") AND  date("now", "localtime", "+1 day"))`
    case 'Esta semana':
      return ` AND (${field} BETWEEN date('now', 'weekday 1', '-7 day') AND date('now', 'weekday 1', '-1 day'))`
    case 'Últimos 7 días':
      return ` AND (${field} BETWEEN date("now", "localtime", "-7 day") AND date("now", "localtime", "+1 day"))`
    case 'Últimos 15 días':
    return ` AND (${field} BETWEEN date("now", "localtime", "-15 day") AND date("now", "localtime", "+1 day"))`
    case 'Últimos 30 días':
    return ` AND (${field} BETWEEN date("now", "localtime", "-30 day") AND date("now", "localtime", "+1 day"))`
    case 'Este mes':
      return ` AND (${field} BETWEEN date("now", "localtime", "start of month")
      AND date("now", "localtime", "start of month", "+1 month", "-1 day"))`
    case 'Ninguna':
      return ` AND (${field} is null)`
    case 'Ninguna o en el futuro':
      return ` AND (${field} is null OR ${field} > date("now", "localtime"))`
    default:
      throw 'Not recognized the WHERE parameter ' + value
  }
}

//Tested
export function getWork (workId, fileName) {
  db = new sqlite3.Database(fileName)
  var query = 'SELECT * FROM vTrabajos ' +
  'WHERE IdTrabajo = ?'
  return getAsync(db, query, [workId]).then((row) => {
    return row
  })
}

//Tested
export function insertWork(work, fileName) {
  db = new sqlite3.Database(fileName)
  var query = 'INSERT INTO Trabajos (IdDentista, IdTipoTrabajo, ' +
    'Paciente, Color, FechaTerminacion, FechaEntrada, ' +
    'FechaPrevista, PrecioFinal, PrecioMetal) ' +
    'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
  return runAsync(db, query, [work.IdDentista, work.IdTipoTrabajo, work.Paciente,
    work.Color, work.FechaTerminacion, work.FechaEntrada, work.FechaPrevista,
    work.PrecioFinal, work.PrecioMetal])
  }

//Tested
export function updateWork(work, fileName) {
  db = new sqlite3.Database(fileName)
  var query = 'UPDATE Trabajos SET IdDentista = ?, IdTipoTrabajo = ?, ' +
  'Paciente = ?, Color = ?, FechaTerminacion = ?, ' +
  'FechaEntrada = ?, FechaPrevista = ?, ' +
  'PrecioMetal = ?, Nombre = ? ' +
  'WHERE IdTrabajo = ?'
  return runAsync(db, query, [work.IdDentista, work.IdTipoTrabajo, work.Paciente,
    work.Color, work.FechaTerminacion, work.FechaEntrada, work.FechaPrevista,
    work.PrecioMetal, work.Nombre, work.IdTrabajo])
}

// Work Indications -----------------------------------------------------------

//Tested
export function getWorkIndications (workId, fileName) {
  db = new sqlite3.Database(fileName)
  var query = 'SELECT IdTrabajoDetalle, IdTrabajo, Descripcion, Precio ' +
  'FROM TrabajosDetalle ' +
  'WHERE IdTrabajo = ?'
  return allAsync(db, query, [workId]).then((rows) => {
    return rows
  })
}

//Tested
export function insertWorkIndications(workIndication, fileName) {
  db = new sqlite3.Database(fileName)
  var query = 'INSERT INTO TrabajosDetalle (IdTrabajo, ' +
  'Descripcion, Precio) ' +
  'VALUES (?, ?, ?)'
  return runAsync(db, query, [workIndication.IdTrabajo,
    workIndication.Descripcion , workIndication.Precio])
  }

//Tested
export function updateWorkIndications(workIndication, fileName) {
  db = new sqlite3.Database(fileName)
  var query = 'UPDATE TrabajosDetalle ' +
  'SET Descripcion = ?, Precio = ? ' +
  'WHERE IdTrabajoDetalle = ?'
  return runAsync(db, query, [workIndication.Descripcion, workIndication.Precio, workIndication.IdTrabajoDetalle])
}

//Tested
export function deleteWorkIndications(workIndication, fileName){
  db = new sqlite3.Database(fileName)
  var query = 'DELETE FROM TrabajosDetalle WHERE IdTrabajoDetalle = ?'
  return runAsync(db, query, [workIndication.IdTrabajoDetalle])
}

export function updatePriceSum(workId, fileName){
  db = new sqlite3.Database(fileName)
  var query = 'UPDATE Trabajos SET PrecioFinal = (SELECT SUM(Precio) FROM TrabajosDetalle WHERE IdTrabajo = ?) WHERE IdTrabajo = ?'
  return runAsync(db, query, [workId, workId])
}

// Work Tests -----------------------------------------------------------------

//Tested
export function getWorkTestsList (workId, fileName) {
  db = new sqlite3.Database(fileName)
  var query = 'SELECT * FROM vPruebas ' +
  'WHERE IdTrabajo = ?'
  return allAsync(db, query, [workId]).then((rows) => {
    return rows
  })
}

//Tested
export function getDeliveryShifts(fileName) {
  db = new sqlite3.Database(fileName)
  var query = 'SELECT IdTurno, Descripcion FROM Turnos'
  return allAsync(db, query, []).then((rows) => {
    return rows
  })
}

//Tested
export function insertWorkTest(workTest, fileName) {
  db = new sqlite3.Database(fileName)
  var query = 'INSERT INTO Pruebas (IdTrabajo, Descripcion, FechaSalida, ' +
  'FechaEntrada, Comentario, IdTurnoFechaSalida, IdTurnoFechaEntrada) ' +
  'VALUES (?, ?, ?, ?, ?, ?, ?)'
  return runAsync(db, query, [workTest.IdTrabajo, workTest.Descripcion, workTest.FechaSalida,
    workTest.FechaEntrada, workTest.Comentario, workTest.IdTurnoFechaSalida,
    workTest.IdTurnoFechaEntrada])
}

//Tested
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

//Tested
export function deleteWorkTest(workTestId, fileName){
  db = new sqlite3.Database(fileName)
  var query = 'DELETE FROM Pruebas WHERE IdPrueba = ?'
  return runAsync(db, query, [workTestId])
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
      return row
    })
    }


// Work Types -----------------------------------------------------------------

//Tested
export function getWorkTypes (fileName) {
  db = new sqlite3.Database(fileName)
  var query = 'SELECT IdTipoTrabajo, Descripcion FROM TipoTrabajos'

  return allAsync(db, query, []).then((row) => {
    return row
  })
}

// Adjuncts -------------------------------------------------------------------

//Tested
export function getAdjuntsOfWork (workId, fileName) {
  db = new sqlite3.Database(fileName)
  var query = 'SELECT IdAditamento, Caja, Cubeta, Articulador, ' +
  'Pletinas, Tornillos, Analogos, PosteImpresion, ' +
  'Interface, Otros ' +
  'FROM Aditamentos ' +
  'WHERE IdTrabajo = ?'

  return getAsync(db, query, [workId]).then((row) => {
    return row
  })
}

//Tested
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

//Tested
export function updateAdjuntsOfWork(adjunt, fileName) {
  db = new sqlite3.Database(fileName)
  var query = 'UPDATE Aditamentos ' +
    'SET Caja = ?, Cubeta = ?, ' +
    'Articulador = ?, Pletinas = ?, Tornillos = ?,' +
    'Analogos = ?, PosteImpresion = ?, Interface = ?,' +
    'Otros = ? ' +
    'WHERE IdTrabajo = ?'
  return runAsync(db, query, [adjunt.Caja, adjunt.Cubeta, adjunt.Articulador,
      adjunt.Pletinas, adjunt.Tornillos, adjunt.Analogos, adjunt.PosteImpresion,
      adjunt.Interface, adjunt.Otros, adjunt.IdTrabajo])
}

// Dentists -------------------------------------------------------------------

//Tested
export function getDentistList (fileName) {
  db = new sqlite3.Database(fileName)
  var query = 'SELECT * ' +
  'FROM vDentistas'
  return allAsync(db, query, []).then((row) => {
    return row
  })
}

//Tested
export function getDentist (dentistId, fileName) {
  db = new sqlite3.Database(fileName)
  var query = 'SELECT * FROM vDentistas WHERE IdDentista = ?'
  return getAsync(db, query, [dentistId]).then((row) => {
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

// Work Month Check -----------------------------------------------------------

//Tested
export function getWorksAggregatedByDentist (year, month, fileName) {
  db = new sqlite3.Database(fileName)
  var query = 'SELECT d.IdDentista AS Key, d.IdDentista AS IdDentista, d.NombreDentista, ' +
    '  sum(t.PrecioFinal) AS SumaPrecioFinal, ' +
    '  ifnull(sum(t.PrecioMetal), 0) AS SumaAditamentos, ' +
    '  ifnull(sum(CASE WHEN t.IdTipoTrabajo = "1" THEN t.PrecioFinal ELSE 0 END), 0) AS SumaCeramica, ' +
    '  ifnull(sum(CASE WHEN t.IdTipoTrabajo = "2" THEN t.PrecioFinal ELSE 0 END), 0) AS SumaResina, ' +
    '  ifnull(sum(CASE WHEN t.IdTipoTrabajo = "3" THEN t.PrecioFinal ELSE 0 END), 0) AS SumaOrtodoncia, ' +
    '  ifnull(sum(CASE WHEN t.IdTipoTrabajo = "4" THEN t.PrecioFinal ELSE 0 END), 0) AS SumaEsqueletico, ' +
    '  ifnull(sum(CASE WHEN t.IdTipoTrabajo = "5" THEN t.PrecioFinal ELSE 0 END), 0) AS SumaZirconio, ' +
    '  sum(CASE WHEN t.IdTipoTrabajo = "1" THEN t.PrecioFinal ELSE 0 END) - ' +
    '  ifnull(sum(t.PrecioMetal), 0) AS SumaFija, ' +
    '  sum(CASE WHEN t.IdTipoTrabajo = "1" THEN t.PrecioFinal ELSE 0 END) + ' +
    '  sum(CASE WHEN t.IdTipoTrabajo = "2" THEN t.PrecioFinal ELSE 0 END) + ' +
    '  sum(CASE WHEN t.IdTipoTrabajo = "3" THEN t.PrecioFinal ELSE 0 END) + ' +
    '  sum(CASE WHEN t.IdTipoTrabajo = "4" THEN t.PrecioFinal ELSE 0 END) + ' +
    '  sum(CASE WHEN t.IdTipoTrabajo = "5" THEN t.PrecioFinal ELSE 0 END) - ' +
    '  ifnull(sum(t.PrecioMetal), 0) AS SumaTotalMetal, ' +
    ' 0 as percentage, ' +
    ' 0 as SumaDescuento, ' +
    ' ifnull(sum(t.PrecioMetal), 0) + ' +
    ' sum(CASE WHEN t.IdTipoTrabajo = "1" THEN t.PrecioFinal ELSE 0 END) + ' +
    ' sum(CASE WHEN t.IdTipoTrabajo = "2" THEN t.PrecioFinal ELSE 0 END) + ' +
    ' sum(CASE WHEN t.IdTipoTrabajo = "3" THEN t.PrecioFinal ELSE 0 END) + ' +
    ' sum(CASE WHEN t.IdTipoTrabajo = "4" THEN t.PrecioFinal ELSE 0 END) + ' +
    ' sum(CASE WHEN t.IdTipoTrabajo = "5" THEN t.PrecioFinal ELSE 0 END) -  ' +
    ' ifnull(sum(t.PrecioMetal), 0) - 0 AS SumaGranTotal ' +
    'FROM Trabajos t ' +
    'INNER JOIN Dentistas d ON d.IdDentista = t.IdDentista ' +
    'WHERE t.FechaTerminacion BETWEEN date("' + year + '-' + ('00' + month).substr(-2) + '-01") AND date("' + year + '-' + ('00' + month).substr(-2) + '-01", "+1 month") ' +
    'GROUP BY t.IdDentista, d.NombreDentista ' +
    'ORDER BY d.NombreDentista'
  return allAsync(db, query, []).then((rows) => {
    return rows
  })
}

//Tested
export function getWorksDeaggregatedByDentist (year, month, idDentist, fileName) {
  db = new sqlite3.Database(fileName)
  var sMonth = ('00' + month).substr(-2)
  var query = 'SELECT * FROM vTrabajosPorDentista WHERE ' +
  'FechaTerminacion BETWEEN date("' + year + '-' + sMonth + '-01") AND date("' + year + '-' + sMonth + '-01", "+1 month") ' +
  'AND IdDentista = ' + idDentist
  return allAsync(db, query, []).then((rows) => {
    return rows
  })
}

//Tested
export function setCheckToWork (idTrabajo, check, fileName) {
  db = new sqlite3.Database(fileName)
  var query = 'INSERT OR REPLACE INTO TrabajosChequeados (IdTrabajo, Chequeado) VALUES (?, ?)'
  return runAsync(db, query, [idTrabajo, check])
}

// Invoices ------------------------------------------------------------------

  export function getInvoicesList (fileName, customFilters) {
    db = new sqlite3.Database(fileName)
    var query = 'SELECT * FROM vFacturas WHERE 1=1'
    if (customFilters !== undefined){
    }
    return allAsync(db, query, []).then((row) => {
      return row
    })
  }

  export function insertInvoice(invoice, fileName) {
    db = new sqlite3.Database(fileName)
    var query = 'INSERT INTO Facturas (IdDentista, ' +
    'Fecha, Total, Descuento, Banco, Efectivo) ' +
    'VALUES (?, ?, ?, ?, ?, ?)'
    return runAsync(db, query, [invoice.IdFactura, invoice.IdDentista, invoice.Fecha,
      invoice.Total, invoice.Descuento, invoice.Banco, invoice.Efectivo])
  }

  export function getInvoice (invoiceId, fileName) {
    db = new sqlite3.Database(fileName)
    var query = 'SELECT * FROM vFacturas WHERE IdFactura = ?'
    if (customFilters !== undefined){
    }
    return getAsync(db, query, [invoiceId]).then((row) => {
      return row
    })
  }

  export function updateInvoice(invoice, fileName) {
    db = new sqlite3.Database(fileName)
    var query = 'UPDATE Facturas SET IdDentista = ?, ' +
    'Fecha = ?, Total = ?, Descuento = ?, '+
    'Banco = ?, Efectivo = ? ' +
    'WHERE IdFactura = ?'
    return runAsync(db, query, [invoice.IdDentista, invoice.Fecha,
      invoice.Total, invoice.Descuento, invoice.Banco, invoice.Efectivo])
  }

  export function deleteInvoice(invoiceId, fileName) {
    db = new sqlite3.Database(fileName)
    var query = 'DELETE FROM Facturas WHERE IdFactura = ?'
    return runAsync(db, query, [invoiceId])
  }

// Invoice details ------------------------------------------------------------

export function getInvoiceDetails (invoiceId, fileName) {
  db = new sqlite3.Database(fileName)
  var query = 'SELECT * FROM FacturasDetalle WEHRE IdFactura = ?'
  if (customFilters !== undefined){
  }
  return getAsync(db, query, [invoiceId]).then((row) => {
    return row
  })
}

export function insertInvoiceDetail(invoiceDetail, fileName) {
  db = new sqlite3.Database(fileName)
  var query = 'INSERT INTO FacturasDetalle (IdFactura, Descripcion, Precio) VALUES (?, ?, ?)'
  return runAsync(db, query, [invoiceDetail.IdFacturaDetalle, invoiceDetail.Descripcion, invoiceDetail.Precio])
}

export function updateInvoiceDetail(invoiceDetail, fileName) {
  db = new sqlite3.Database(fileName)
  var query = 'UPDATE FacturasDetalle SET IdFactura = ?, Descripcion = ?, Precio = ? ' +
  'WHERE IdFacturaDetalle = ?'
  return runAsync(db, query, [invoiceDetail.IdFactura, invoiceDetail.Descripcion,
    invoiceDetail.Precio, invoiceDetail.IdFacturaDetalle])
}

export function deleteInvoiceDetail(invoiceDetailId, fileName) {
  db = new sqlite3.Database(fileName)
  var query = 'DELETE FROM FacturasDetalle WHERE IdFacturaDetalle = ?'
  return runAsync(db, query, [invoiceDetailId])
}

// Conformity Declarations ----------------------------------------------------

//Tested
export function getConformityDeclaration (workId, fileName) {
  db = new sqlite3.Database(fileName)
  var query1 = 'SELECT * FROM vDeclaracionConformidad WHERE IdTrabajo = ?'
  var query2 = 'SELECT * FROM vDeclaracionProductos ' +
    ' WHERE IdTrabajo = ?'

  var promise1 = getAsync(db, query1, [workId]).then((row) => {
    return row
  })
  var promise2 = allAsync(db, query2, [workId]).then((row) => {
    return row
  })

  return new Promise(function(resolve, reject) {
    Promise.all([promise1, promise2]).then((rows) => {
      resolve({
        data: rows[0],
        details: rows[1]
      })
    })
  })
}

//Tested
export function insertConformityDeclaration(conformity, productIds, fileName) {
  db = new sqlite3.Database(fileName)
  var query = 'INSERT INTO DeclaracionConformidad (IdTrabajo, Fecha, Meses) ' +
  'VALUES (?, date("now"), ?) '
  return runAsync(db, query, [conformity.IdTrabajo, conformity.Meses]).then((conformityId) => {
    return insertDeclarationProducts(conformityId, productIds)
  })
}

//Tested
export function updateConformityDeclaration(conformity, productsIds, fileName){
  db = new sqlite3.Database(fileName)
  var query = 'UPDATE DeclaracionConformidad SET Fecha = date("now"), Meses = ? WHERE IdDeclaracion = ?'
  return runAsync(db, query, [conformity.Meses, conformity.IdDeclaracion]).then(() => {
    var query2 = 'DELETE FROM DeclaracionProductos WHERE IdDeclaracion = ?'
    return runAsync(db, query2, [conformity.IdDeclaracion]).then(() => {
      return insertDeclarationProducts(conformity.IdDeclaracion, productsIds)
    })
  })
}

//Tested
function insertDeclarationProducts(conformityId, productsIds){
  var promises = []
  for (var productId of productsIds){
    var query2 = 'INSERT INTO DeclaracionProductos (IdDeclaracion, IdProductoLote) VALUES (?, ?)'
    promises.push(runAsync(db, query2, [conformityId, productId]).then((id) => {return id}))
  }
  return new Promise(function(resolve) {
    Promise.all(promises).then((rows) => {
      resolve({data: rows})
    })
  })
}

// Products and batches -------------------------------------------------------

//Tested
export function searchProductsByName(productName, fileName){
  db = new sqlite3.Database(fileName)
  var query = 'SELECT IdProductoLote, Descripcion FROM ProductosLotes WHERE Descripcion LIKE ? AND Activo = true'
  return allAsync(db, query, ['%' + productName + '%']).then((rows) => {
    return rows
  })
}

//Tested
export function searchProductByExactName(productName, fileName){
  db = new sqlite3.Database(fileName)
  var query = 'SELECT IdProductoLote, Descripcion FROM ProductosLotes WHERE Descripcion = ? AND Activo = true'
  return allAsync(db, query, ['%' + productName + '%']).then((rows) => {
    return rows
  })
}

export function getProduct(productId, fileName){
  db = new sqlite3.Database(fileName)
  var query = 'SELECT * FROM ProductosLotes WHERE IdProductoLote = ?'
  return getAsync(db, query, [productId]).then((row) => {
    return row
  })
}

//Tested
export function insertProduct(productDescription, fileName){
  db = new sqlite3.Database(fileName)
  var query = 'INSERT INTO ProductosLotes (Descripcion, Activo) VALUES (?, true)'
  return runAsync(db, query, [productDescription])
}

export function updateProduct(product, fileName){

}

export function deleteProduct(productId, fileName){

}

export function getProductList(fileName){

}

// Catalog --------------------------------------------------------------------

export function getCatalogList (fileName) {
  db = new sqlite3.Database(fileName)
  var query = 'SELECT * FROM vCatalogo'
  return allAsync(db, query, []).then((row) => {
    return row
  })
}

// Config ---------------------------------------------------------------------

//Tested
export function getConfigValue(configKey, fileName){
  db = new sqlite3.Database(fileName)
  var query = 'SELECT Valor FROM Configuracion WHERE clave = ?'
  return getAsync(db, query, [configKey]).then((row) => {
    return row
  })
}

//Tested
export function getConfigValues(configKeyArray, fileName){
  db = new sqlite3.Database(fileName)
  var query = 'SELECT * FROM Configuracion WHERE clave IN ('
  for (var value of configKeyArray){
    query += `"${value}",`
  }
  query = query.substring(0, query.length - 1) + ')'
  return allAsync(db, query, []).then((row) => {
    return row
  })
}


export function setConfigValue (configKey, configValue, fileName) {
  db = new sqlite3.Database(fileName)
  var query = 'INSERT OR REPLACE INTO Configuracion (clave, valor) VALUES (?, ?)'
  return runAsync(db, query, [configKey, configValue])
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
    db.run(sql, params, function (err, row){
      if (err) {
        reject(err)
      } else {
        // resolve(row)
        resolve(this.lastID)
      }
    })
  })
}
