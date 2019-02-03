'use strict'

var sqlite3 = require('sqlite3').verbose()
var db

import _ from 'lodash'
import { configGet } from '../main/store'

export async function loadDbFile(){
  try {
    db = new sqlite3.Database(configGet('dataFile'))
    var x = await getConfigValue('companyName')
  } catch (err) {
    //Looks not to be a good sqlite database. Reject it
    return false
  }
  require('electron').ipcRenderer.send('file:opened', db.filename.replace(/^.*[\\\/]/, '').replace(/\.[^/.]+$/, ''))
  return true
}

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

export function createNewDatabase () {
  db = new sqlite3.Database(configGet('dataFile'), createTable)
}

// Works ----------------------------------------------------------------------

//Tested
export async function getWorksList (customFilters) {
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

  return allAsync(db, query, [])
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
      return ` AND (${field} BETWEEN date("now", "localtime", "start of month") AND date("now", "localtime", "start of month", "+1 month", "-1 day"))`
    case 'Mes pasado':
      return ` AND (${field} BETWEEN date("now", "localtime", "start of month", "-1 month") AND date("now", "localtime"))`
    case 'Hace dos meses':
      return ` AND (${field} BETWEEN date("now", "localtime", "start of month", "-2 month") AND date("now", "localtime"))`
    case 'Hace tres meses':
      return ` AND (${field} BETWEEN date("now", "localtime", "start of month", "-3 month") AND date("now", "localtime"))`
    case 'Hace seis meses':
      return ` AND (${field} BETWEEN date("now", "localtime", "start of month", "-6 month") AND date("now", "localtime"))`
    case 'Ninguna':
      return ` AND (${field} is null)`
    case 'Ninguna o en el futuro':
      return ` AND (${field} is null OR ${field} > date("now", "localtime"))`
    default:
      throw 'Not recognized the WHERE parameter ' + value
  }
}

//Tested
export async function getWork(workId) {
  var query = 'SELECT * FROM vTrabajos ' +
  'WHERE IdTrabajo = ?'
  return await getAsync(db, query, [workId])
}

//Tested
export async function insertWork(work) {
  var query = 'INSERT INTO Trabajos (IdDentista, IdTipoTrabajo, ' +
    'Paciente, Color, FechaTerminacion, FechaEntrada, ' +
    'FechaPrevista, FechaPrevistaPrueba, PrecioFinal, PrecioMetal) ' +
    'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
  var id = await runAsync(db, query, [work.IdDentista, work.IdTipoTrabajo, work.Paciente,
    work.Color, work.FechaTerminacion, work.FechaEntrada, work.FechaPrevista, work.FechaPrevistaPrueba,
    work.PrecioFinal, work.PrecioMetal])
  return id
  }

//Tested
export async function updateWork(work) {
  var query = 'UPDATE Trabajos SET IdDentista = ?, IdTipoTrabajo = ?, ' +
  'Paciente = ?, Color = ?, FechaTerminacion = ?, ' +
  'FechaEntrada = ?, FechaPrevista = ?, FechaPrevistaPrueba = ?, ' +
  'PrecioMetal = ?, Nombre = ? ' +
  'WHERE IdTrabajo = ?'
  return await runAsync(db, query, [work.IdDentista, work.IdTipoTrabajo, work.Paciente,
    work.Color, work.FechaTerminacion, work.FechaEntrada, work.FechaPrevista, work.FechaPrevistaPrueba,
    work.PrecioMetal, work.Nombre, work.IdTrabajo])
}

// Work Indications -----------------------------------------------------------

//Tested
export async function getWorkIndications (workId) {
  var query = 'SELECT IdTrabajoDetalle, IdTrabajo, Descripcion, Precio ' +
  'FROM TrabajosDetalle ' +
  'WHERE IdTrabajo = ?'
  return await allAsync(db, query, [workId])
}

//Tested
export function insertWorkIndications(workIndication) {
  var query = 'INSERT INTO TrabajosDetalle (IdTrabajo, ' +
  'Descripcion, Precio) ' +
  'VALUES (?, ?, ?)'
  return runAsync(db, query, [workIndication.IdTrabajo,
    workIndication.Descripcion , workIndication.Precio])
  }

//Tested
export function updateWorkIndications(workIndication) {
  var query = 'UPDATE TrabajosDetalle ' +
  'SET Descripcion = ?, Precio = ? ' +
  'WHERE IdTrabajoDetalle = ?'
  return runAsync(db, query, [workIndication.Descripcion, workIndication.Precio, workIndication.IdTrabajoDetalle])
}

//Tested
export function deleteWorkIndications(workIndication){
  var query = 'DELETE FROM TrabajosDetalle WHERE IdTrabajoDetalle = ?'
  return runAsync(db, query, [workIndication.IdTrabajoDetalle])
}

export function updatePriceSum(workId){
  var query = 'UPDATE Trabajos SET PrecioFinal = (SELECT SUM(Precio) FROM TrabajosDetalle WHERE IdTrabajo = ?) WHERE IdTrabajo = ?'
  return runAsync(db, query, [workId, workId])
}

// Work Tests -----------------------------------------------------------------

//Tested
export async function getWorkTestsList (workId) {
  var query = 'SELECT * FROM vPruebas ' +
  'WHERE IdTrabajo = ?'
  return await allAsync(db, query, [workId])//.then((rows) => {
  //   return rows
  // })
}

//Tested
export function getDeliveryShifts() {
  var query = 'SELECT IdTurno, Descripcion FROM Turnos'
  return allAsync(db, query, []).then((rows) => {
    return rows
  })
}

//Tested
export function insertWorkTest(workTest) {
  var query = 'INSERT INTO Pruebas (IdTrabajo, Descripcion, FechaSalida, ' +
  'FechaEntrada, Comentario, IdTurnoFechaSalida, IdTurnoFechaEntrada) ' +
  'VALUES (?, ?, ?, ?, ?, ?, ?)'
  return runAsync(db, query, [workTest.IdTrabajo, workTest.Descripcion, workTest.FechaSalida,
    workTest.FechaEntrada, workTest.Comentario, workTest.IdTurnoFechaSalida,
    workTest.IdTurnoFechaEntrada])
}

//Tested
export function updateWorkTest(workTest) {
  var query = 'UPDATE Pruebas SET IdTrabajo = ?, Descripcion = ?, FechaSalida = ?, ' +
    'FechaEntrada = ?, Comentario = ?, IdTurnoFechaSalida = ?, ' +
    'IdTurnoFechaEntrada = ? ' +
    'WHERE IdPrueba = ?'
    return runAsync(db, query, [workTest.IdTrabajo, workTest.Descripcion, workTest.FechaSalida,
      workTest.FechaEntrada, workTest.Comentario, workTest.IdTurnoFechaSalida,
      workTest.IdTurnoFechaEntrada, workTest.IdPrueba])
}

//Tested
export function deleteWorkTest(workTestId){
  var query = 'DELETE FROM Pruebas WHERE IdPrueba = ?'
  return runAsync(db, query, [workTestId])
}

//Tested
export async function setInboundWorkTestToToday(workTestId){
  var query = 'UPDATE Pruebas ' +
  'SET FechaEntrada = date("now", "localtime"), ' +
  'IdTurnoFechaEntrada = 2 - (time("now") BETWEEN time("08:00:00") AND time("17:30:00")) ' +
  'WHERE IdTrabajo = ? AND FechaEntrada IS NULL AND FechaSalida = ' +
  '(SELECT MAX(FechaSalida) FROM Pruebas WHERE IdTrabajo = ?)'
  return await runAsync(db, query, [workTestId, workTestId])
}

//Tested
export async function unsetInboundTestToToday(workTestId){
  var query = 'UPDATE Pruebas ' +
  'SET FechaEntrada = NULL, ' +
  'IdTurnoFechaEntrada = NULL ' +
  'WHERE IdTrabajo = ? AND date(FechaEntrada, "localtime") = date("now", "localtime") AND FechaSalida = ' +
  '(SELECT MAX(FechaSalida) FROM Pruebas WHERE IdTrabajo = ?)'
  return await runAsync(db, query, [workTestId, workTestId])
}

// Custom queries for Work (KPIs)----------------------------------------------

//Tested
export async function getWorkInExecution () {
  var query = 'SELECT COUNT(1) AS Count ' +
  'FROM Trabajos ' +
  'WHERE FechaTerminacion is NULL OR FechaTerminacion >= date("now", "localtime")'
  return await getAsync(db, query, [])
}

//Tested
export async function getWorksEndedThisMonth() {
  var query = 'SELECT COUNT(1) AS Count ' +
  'FROM Trabajos t ' +
  'WHERE FechaTerminacion >= date("now", "localtime", "start of month") ' +
  'AND FechaTerminacion <= date("now", "localtime")'
  return await getAsync(db, query, [])
}

//Tested
export async function getWorksEndedLast30days() {
  var query = 'SELECT COUNT(1) AS Count, SUM(PrecioFinal) AS Sum ' +
  'FROM Trabajos ' +
  'WHERE FechaTerminacion >= date("now", "localtime", "-30 days")'
  return await getAsync(db, query, [])
  }

  //Tested
  export async function getWorksEndedPrevious30days() {
    var query = 'SELECT COUNT(1) AS Count, SUM(PrecioFinal) AS Sum ' +
    'FROM Trabajos ' +
    'WHERE FechaTerminacion >= date("now", "localtime", "-60 days") '+
    'AND FechaTerminacion <= date("now", "localtime", "-30 days")'
    return await getAsync(db, query, [])
  }

  //Tested
  export async function getMonthTotals() {
    var query = 'SELECT strftime("%m", FechaTerminacion) AS Month, ' +
    'strftime("%Y", FechaTerminacion) AS Year, SUM(PrecioFinal) AS Sum ' +
    'FROM Trabajos ' +
    'WHERE FechaTerminacion IS NOT NULL AND FechaTerminacion != "" ' +
    'GROUP BY Month, Year'
    var data = await allAsync(db, query, [])
    var thisYearData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    var previousYearData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    _.forEach(_.filter(data, ['Year', new Date().getFullYear().toString()]), (v) => { thisYearData[parseInt(v.Month) - 1] = parseFloat(v.Sum).toFixed(2)})
    _.forEach(_.filter(data, ['Year', (new Date().getFullYear() - 1).toString()]), (v) => { previousYearData[parseInt(v.Month) - 1] = parseFloat(v.Sum).toFixed(2)})
    return {
      thisYear: thisYearData,
      lastYear: previousYearData
    }
  }

  export async function getLeaderboard(limit) {
    var query = 'SELECT d.NombreDentista, ' +
      'SUM(t.PrecioFinal) AS Sum ' +
      'FROM Trabajos t ' +
      'INNER JOIN Dentistas d ON d.IdDentista = t.IdDentista ' +
      'WHERE FechaTerminacion >= date("now", "localtime", "-1 year") ' +
      'GROUP BY d.NombreDentista ' +
      'ORDER BY Sum DESC '
    if (limit !== undefined){
      query += 'LIMIT ' + limit
    }

    return await allAsync(db, query, [])
  }


// Work Types -----------------------------------------------------------------

//Tested
export function getWorkTypes () {
  var query = 'SELECT IdTipoTrabajo, Descripcion FROM TipoTrabajos'

  return allAsync(db, query, []).then((row) => {
    return row
  })
}

// Adjuncts -------------------------------------------------------------------

//Tested
export async function getAdjuntsOfWork (workId) {
  var query = 'SELECT IdAditamento, Caja, Cubeta, Articulador, ' +
  'Pletinas, Tornillos, Analogos, PosteImpresion, ' +
  'Interface, Otros ' +
  'FROM Aditamentos ' +
  'WHERE IdTrabajo = ?'

  return await getAsync(db, query, [workId])
}

//Tested
export function insertAdjuntsOfWork(adjunt) {
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
export function updateAdjuntsOfWork(adjunt) {
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
export async function getDentistList () {
  var query = 'SELECT * FROM vDentistas'
  return await allAsync(db, query, [])
}

//Tested
export async function getDentist (dentistId) {
  var query = 'SELECT * FROM vDentistas WHERE IdDentista = ?'
  return await getAsync(db, query, [dentistId])
}

//Tested
export function insertDentist(dentist) {
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
export function updateDentist(dentist) {
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
export async function searchDentistsByName (dentistName) {
  var query = 'SELECT IdDentista, NombreDentista, NombreClinica, ' +
  'DatosFiscales, Direccion, DatosBancarios, DatosInteres, CorreoElectronico, ' +
  'CP, Poblacion, Telefono, Telefono2 FROM Dentistas WHERE NombreDentista LIKE ?'
  return await allAsync(db, query, ['%' + dentistName + '%'])
}

//Tested
export async function searchDentistByExactName (dentistName) {
  var query = 'SELECT IdDentista, NombreDentista, NombreClinica, ' +
  'DatosFiscales, Direccion, DatosBancarios, DatosInteres, CorreoElectronico, ' +
  'CP, Poblacion, Telefono, Telefono2 FROM Dentistas WHERE NombreDentista = ?'
  return await allAsync(db, query, [dentistName])
}

// Work Month Check -----------------------------------------------------------

//Tested
export async function getWorksAggregatedByDentist (year, month, readOnly) {
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
    'INNER JOIN Dentistas d ON d.IdDentista = t.IdDentista '

    if (!readOnly){
      query += 'LEFT JOIN FacturasTrabajos ft ON ft.IdTrabajo = t.IdTrabajo '
    }

    query += 'WHERE t.FechaTerminacion BETWEEN date("' + year + '-' + ('00' + month).substr(-2) + '-01") AND date("' + year + '-' + ('00' + month).substr(-2) + '-01", "+1 month", "-1 day") '
    if (!readOnly){
      query += 'AND ft.IdFactura IS NULL '
    }
    query += 'GROUP BY t.IdDentista, d.NombreDentista ' +
    'ORDER BY d.NombreDentista'
    return allAsync(db, query, [])
}

//Tested
export async function getWorksDeaggregatedByDentist (year, month, idDentist, isReadOnly = false) {
  var sMonth = ('00' + month).substr(-2)
  if (!isReadOnly){
    var query = 'SELECT * FROM vTrabajosPorDentista WHERE ' +
    'FechaTerminacion BETWEEN date("' + year + '-' + sMonth + '-01") AND date("' + year + '-' + sMonth + '-01", "+1 month", "-1 day") ' +
    'AND IdDentista = ' + idDentist
    return await allAsync(db, query, [])
  } else {
    var query = 'SELECT * FROM vTodosTrabajosPorDentista WHERE ' +
    'FechaTerminacion BETWEEN date("' + year + '-' + sMonth + '-01") AND date("' + year + '-' + sMonth + '-01", "+1 month", "-1 day") ' +
    'AND IdDentista = ' + idDentist
    return await allAsync(db, query, [])
  }
}

//Tested
export async function setCheckToWork (idTrabajo, check) {
  var query = 'INSERT OR REPLACE INTO TrabajosChequeados (IdTrabajo, Chequeado) VALUES (?, ?)'
  return runAsync(db, query, [idTrabajo, check])
}

// Invoices ------------------------------------------------------------------

//Tested
export async function getInvoicesList (customFilters) {
  var query = 'SELECT * FROM vFacturas WHERE 1=1'
  if (customFilters !== undefined){
    if (customFilters.fFactura !== undefined) {
      query += processDateQuery('Fecha', customFilters.fFactura)
    } else if (customFilters.fInicio !== undefined && customFilters.fFin !== undefined) {
      query += ` AND Fecha BETWEEN date("${customFilters.fInicio}") AND date("${customFilters.fFin}")`
    } else if(customFilters.fInicio !== undefined && customFilters.fFin === undefined){
      query += ` AND Fecha >= date("${customFilters.fInicio}")`
    } else if(customFilters.fInicio === undefined && customFilters.fFin !== undefined){
      query += ` AND Fecha <= date("${customFilters.fFin}")`
    }
  }
  return await allAsync(db, query, [])
}

  //Tested
  export async function insertInvoice(idDentist, works, invoiceDate) {
    var worksString = ''
    for (var value of works) {
      worksString += `${value.idTrabajo},`
    }
    worksString =  worksString.substr(0, worksString.length - 1)

    var totalDiscount = _.sumBy(works, (o) => {
      return parseFloat(o.totalDescuento)
    })

    var query1 = 'INSERT INTO Facturas(NumFactura, IdDentista, Fecha, Total) ' +
    'VALUES ( ' +
    '  (SELECT CASE WHEN ( ' +
    '    SELECT EXISTS( ' +
    '      SELECT max(IdFactura) AS IdFactura, strftime("%Y", Fecha) as year ' +
    '      FROM Facturas WHERE year = strftime("%Y", date(?)) GROUP BY year ' +
    '      ) ' +
    '    ) == 0 ' +
    '  THEN 1 ' +
    '  ELSE ' +
    '    (SELECT NumFactura + 1 FROM ' +
    '      (SELECT max(NumFactura) AS NumFactura, strftime("%Y", Fecha) as year FROM Facturas WHERE year = strftime("%Y", date(?)) GROUP BY year ' +
    '      ) ' +
    '    ) ' +
    '  END), ' +
    '  ?, ' +
    '  date(?), ' +
    `  (SELECT SUM(PrecioFinal) - ${totalDiscount} FROM Trabajos WHERE IdTrabajo IN (${worksString})) ` +
    ')'
    var idInvoice = await runAsync(db, query1, [ invoiceDate, invoiceDate, idDentist, invoiceDate ])
    for (var value of works) {
      var query2 = 'INSERT INTO FacturasTrabajos (IdFactura, IdTrabajo, PorcentajeDescuento, TotalDescuento) VALUES (?, ?, ?, ?)'
      await runAsync(db, query2, [idInvoice, value.idTrabajo, value.porcentajeDescuento, value.totalDescuento])
    }
    return idInvoice
  }

  //Tested
  export async function getInvoice (invoiceId) {
    var query1 = 'SELECT * FROM vFacturas WHERE IdFactura = ?'
    var query2 = 'SELECT * FROM vFacturasTrabajos WHERE IdFactura = ?'
    var invoice = await getAsync(db, query1, [invoiceId])
    var invoiceWorks = await allAsync(db, query2, [invoiceId])
    return {
      invoice: invoice,
      invoiceWorks: invoiceWorks
    }
  }

  //Tested
  export async function getInvoicesPerDentist(year, month, idDentist) {
    var query = 'SELECT * FROM vFacturasTrabajosPorDentista WHERE IdDentista = ? ' +
    `AND FechaFactura BETWEEN date("${year}-${('00' + month).substr(-2)}-01") AND date("${year}-${('00' + month).substr(-2)}-01", "+1 month", "-1 day")`

    return await allAsync(db, query, [idDentist])
  }

  //Tested
  export async function getInvoicePerWork(idWork) {
    var query = 'SELECT ft.IdFactura, ' +
      'strftime("%Y", f.Fecha) || "/" || (substr("00000" || f.NumFactura, -5, 5)) AS NumFactura ' +
      'FROM Facturas f ' +
      'INNER JOIN FacturasTrabajos ft ON f.IdFactura = ft.IdFactura ' +
      'WHERE ft.IdTrabajo = ?'

      return await getAsync(db, query, [idWork])
  }

  // export function updateInvoice(invoice) {
  //   var query = 'UPDATE Facturas SET IdDentista = ?, ' +
  //   'Fecha = ?, Total = ? ' +
  //   'WHERE IdFactura = ?'
  //   return runAsync(db, query, [invoice.IdDentista, invoice.Fecha,
  //     invoice.Total, invoice.Descuento, invoice.Banco, invoice.Efectivo])
  // }

  // export function deleteInvoice(invoiceId) {
  //   var query = 'DELETE FROM Facturas WHERE IdFactura = ?'
  //   return runAsync(db, query, [invoiceId])
  // }

// SELECT max(IdFactura), strftime('%Y', Fecha) as year
// FROM Facturas
// WHERE year='2018'
// GROUP BY year

// CREATE TABLE FacturasTrabajos (
//   IdFactura   INTEGER REFERENCES Facturas (IdFactura),
//   IdTrabajo   INTEGER REFERENCES Trabajos (IdTrabajo),
//   EsDescuento BOOLEAN NOT NULL DEFAULT (false) ,
//   PRIMARY KEY (IdFactura, IdTrabajo)
// );


// Conformity Declarations ----------------------------------------------------

//Tested
export async function getConformityDeclaration (workId) {
  var query1 = 'SELECT * FROM vDeclaracionConformidad WHERE IdTrabajo = ?'
  var query2 = 'SELECT * FROM vDeclaracionProductos ' +
    ' WHERE IdTrabajo = ?'

  return {
    data: await getAsync(db, query1, [workId]),
    details: await allAsync(db, query2, [workId])
  }
}

//Tested
export function insertConformityDeclaration(conformity, productIds) {
  var query = 'INSERT INTO DeclaracionConformidad (IdTrabajo, Fecha, Meses, ProductoEspecifico) ' +
  'VALUES (?, ?, ?, ?) '
  return runAsync(db, query, [conformity.IdTrabajo, conformity.Fecha, conformity.Meses, conformity.ProductoEspecifico]).then((conformityId) => {
    return insertDeclarationProducts(conformityId, productIds)
  })
}

//Tested
export function updateConformityDeclaration(conformity, productsIds){
  var query = 'UPDATE DeclaracionConformidad SET Fecha = date("now"), Meses = ?, ProductoEspecifico = ? WHERE IdDeclaracion = ?'
  return runAsync(db, query, [conformity.Meses, conformity.ProductoEspecifico, conformity.IdDeclaracion]).then(() => {
    var query2 = 'DELETE FROM DeclaracionProductos WHERE IdDeclaracion = ?'
    return runAsync(db, query2, [conformity.IdDeclaracion]).then(() => {
      return insertDeclarationProducts(conformity.IdDeclaracion, productsIds)
    })
  })
}

//Tested
export function insertDeclarationProducts(conformityId, productsIds){
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
export function searchProductsByName(productName){
  var query = 'SELECT IdProductoLote, Descripcion FROM ProductosLotes WHERE Descripcion LIKE ? AND Activo = true'
  return allAsync(db, query, ['%' + productName + '%']).then((rows) => {
    return rows
  })
}

//Tested
export function searchProductByExactName(productName){
  var query = 'SELECT IdProductoLote, Descripcion FROM ProductosLotes WHERE Descripcion = ? AND Activo = true'
  return allAsync(db, query, ['%' + productName + '%']).then((rows) => {
    return rows
  })
}

//Tested
export function getProduct(productId){
  var query = 'SELECT * FROM ProductosLotes WHERE IdProductoLote = ?'
  return getAsync(db, query, [productId]).then((row) => {
    return row
  })
}

//Tested
export async function insertProduct(product){
  var query = 'INSERT INTO ProductosLotes (Descripcion, Activo) VALUES (?, true)'
  return await runAsync(db, query, [product.Descripcion])
}

export async function updateProduct(product){
  var query = 'UPDATE ProductosLotes SET Descripcion = ? ' +
  'WHERE IdProductoLote = ?'
  return await runAsync(db, query, [product.Descripcion, product.IdProductoLote])
}

//Tested
export async function deleteProduct(product){
  var query = 'UPDATE ProductosLotes SET Activo = false ' +
  'WHERE IdProductoLote = ?'
  return await runAsync(db, query, [product.IdProductoLote])
}

//Tested
export async function getProductList(customFilters){
  var query = 'SELECT * FROM ProductosLotes WHERE Activo = true '
  if (customFilters !== undefined){
    query += ` AND Descripcion LIKE "%${customFilters}%" `
  }
  query += 'ORDER BY Descripcion'
  return await allAsync(db, query, [])
}

// Catalog --------------------------------------------------------------------

//Tested
export async function getCatalogList (customFilters) {
  var query = 'SELECT * FROM vCatalogo WHERE 1=1'
  if (customFilters !== undefined){
    query += ` AND Descripcion LIKE "%${customFilters}%"`
  }
  return await allAsync(db, query, [])
}

//Tested
export async function insertCatalogEntry(catalogEntry) {
  var query = 'INSERT INTO Catalogo (Descripcion, Precio, FechaInicio, FechaFin, Activo) ' +
  'VALUES (?, ?, date("now", "localtime"), NULL, true)'
  return await runAsync(db, query, [catalogEntry.Descripcion, catalogEntry.Precio])
}

//Tested
export async function updateCatalogEntry(catalogEntry) {
  // var query = 'UPDATE Catalogo SET Descripcion = ?, Precio = ?' +
  // 'WHERE IdElementoCatalogo = ?'
  // return await runAsync(db, query, [catalogEntry.Descripcion, catalogEntry.Precio, catalogEntry.IdElementoCatalogo])
  deleteCatalogEntry(catalogEntry)
  insertCatalogEntry(catalogEntry)
}

//Tested
export async function deleteCatalogEntry(catalogEntry) {
  var query = 'UPDATE Catalogo SET FechaFin = date("now", "localtime"), Activo = false ' +
  'WHERE IdElementoCatalogo = ?'
  return await runAsync(db, query, [catalogEntry.IdElementoCatalogo])
}

//Dashboard -------------------------------------------------------------------

//Tested
export async function getWaitingInbound () {
  var query = 'SELECT * FROM vDashboard_EsperandoEntrada'
  return await allAsync(db, query, [])
}

//Tested
export async function getOutboundingTests () {
  var query = 'SELECT * FROM vDashboard_PruebasSalenHoy'
  return await allAsync(db, query, [])
}

//Tested
export async function getOutboundingWorks () {
  var query = 'SELECT * FROM vDashboard_TrabajosSalenHoy'
  return await allAsync(db, query, [])
}


// Config ---------------------------------------------------------------------

//Tested
export async function getConfigValue(configKey){
  var query = 'SELECT Valor FROM Configuracion WHERE clave = ?'
  return (await getAsync(db, query, [configKey])).valor
}

//tested
export async function getConfigValues(configKeyArray){
  var query = 'SELECT * FROM Configuracion'
  if (configKeyArray !== undefined) {
    query += ' WHERE clave IN ('
    for (var value of configKeyArray){
      query += `"${value}",`
    }
    query = query.substring(0, query.length - 1) + ')'
  }

  return await allAsync(db, query, [])
}

export async function setConfigValue (configKey, configValue) {
  var query = 'INSERT OR REPLACE INTO Configuracion (clave, valor) VALUES (?, ?)'
  return await runAsync(db, query, [configKey, configValue])
}

// Generic functions ----------------------------------------------------------

function getAsync (db, sql, params) {
  return new Promise(function (resolve, reject) {
    db.get(sql, params, function (err, row) {
      if (err) {
        reject(err)
        console.log(`SQL Error. Params: ${params}| Query: ${sql}`)
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
        console.log(`SQL Error. Params: ${params}| Query: ${sql}`)
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
        console.log(`SQL Error. Params: ${params}| Query: ${sql}`)
      } else {
        // resolve(row)
        resolve(this.lastID)
      }
    })
  })
}
