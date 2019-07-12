// eslint-disable-next-line no-unused-expressions
'use strict'

import _ from 'lodash'
import PersistenceService from './PersistenceService'

export default class InvoiceService extends PersistenceService {
  // Tested
  async getInvoicesList(customFilters) {
    var query = 'SELECT * FROM vFacturas WHERE 1=1'
    if (customFilters !== undefined) {
      if (customFilters.fFactura !== undefined) {
        query += this.processDateQuery('Fecha', customFilters.fFactura)
      } else if (customFilters.fInicio !== undefined && customFilters.fFin !== undefined) {
        query += ` AND Fecha BETWEEN date("${customFilters.fInicio}") AND date("${customFilters.fFin}")`
      } else if (customFilters.fInicio !== undefined && customFilters.fFin === undefined) {
        query += ` AND Fecha >= date("${customFilters.fInicio}")`
      } else if (customFilters.fInicio === undefined && customFilters.fFin !== undefined) {
        query += ` AND Fecha <= date("${customFilters.fFin}")`
      }
    }
    return this.allAsync(query, [])
  }

  // Tested
  async insertInvoice(idDentist, works, invoiceDate) {
    var worksString = ''
    for (var value of works) {
      worksString += `${value.idTrabajo},`
    }
    worksString = worksString.substr(0, worksString.length - 1)

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
      `  (SELECT SUM(PrecioConDescuento) FROM Trabajos WHERE IdTrabajo IN (${worksString})) ` +
      ')'
    var idInvoice = await this.runAsync(query1, [invoiceDate, invoiceDate, idDentist, invoiceDate])
    for (var value of works) {
      var query2 = 'INSERT INTO FacturasTrabajos (IdFactura, IdTrabajo) VALUES (?, ?)'
      await this.runAsync(query2, [idInvoice, value.idTrabajo])
    }
    return idInvoice
  }

  // Tested
  async getInvoice(invoiceId) {
    var query1 = 'SELECT * FROM vFacturas WHERE IdFactura = ?'
    var query2 = 'SELECT * FROM vFacturasTrabajos WHERE IdFactura = ?'
    var invoice = await this.getAsync(query1, [invoiceId])
    var invoiceWorks = await this.allAsync(query2, [invoiceId])
    return {
      invoice: invoice,
      invoiceWorks: invoiceWorks
    }
  }

  // Tested
  async getInvoicesPerDentist(year, month, idDentist) {
    var query = 'SELECT * FROM vFacturasTrabajosPorDentista WHERE IdDentista = ? ' +
      `AND FechaFactura BETWEEN date("${year}-${('00' + month).substr(-2)}-01") AND date("${year}-${('00' + month).substr(-2)}-01", "+1 month", "-1 day")`

    return this.allAsync(query, [idDentist])
  }

  // Tested
  async getInvoicePerWork(idWork) {
    var query = 'SELECT ft.IdFactura, ' +
      'strftime("%Y", f.Fecha) || "/" || (substr("00000" || f.NumFactura, -5, 5)) AS NumFactura ' +
      'FROM Facturas f ' +
      'INNER JOIN FacturasTrabajos ft ON f.IdFactura = ft.IdFactura ' +
      'WHERE ft.IdTrabajo = ?'

    return this.getAsync(query, [idWork])
  }

  async updateInvoiceGrandTotal(invoiceId) {
    var query = 'UPDATE Facturas ' +
      'SET Total = (SELECT sum(PrecioConDescuento) FROM vFacturasTrabajos WHERE IdFactura = ?) ' +
      'WHERE IdFactura = ?'
    return this.runAsync(query, [invoiceId, invoiceId])
  }

  async removeWorkFromInvoice(invoiceId, workId) {
    var query = 'DELETE FROM FacturasTrabajos ' +
      'WHERE IdFactura = ? AND IdTrabajo = ? '
    return this.runAsync(query, [invoiceId, workId])
  }

  // updateInvoice(invoice) {
  //   var query = 'UPDATE Facturas SET IdDentista = ?, ' +
  //   'Fecha = ?, Total = ? ' +
  //   'WHERE IdFactura = ?'
  //   return this.runAsync(query, [invoice.IdDentista, invoice.Fecha,
  //     invoice.Total, invoice.Descuento, invoice.Banco, invoice.Efectivo])
  // }

  // deleteInvoice(invoiceId) {
  //   var query = 'DELETE FROM Facturas WHERE IdFactura = ?'
  //   return this.runAsync(query, [invoiceId])
  // }
}