// eslint-disable-next-line no-unused-expressions
'use strict'

import _ from 'lodash'
import PersistenceService from './PersistenceService'

export default class KpiService extends PersistenceService {
  // Tested
  async getWorkInExecution() {
    var query = 'SELECT COUNT(1) AS Count ' +
      'FROM Trabajos ' +
      'WHERE FechaTerminacion is NULL OR FechaTerminacion >= date("now", "localtime")'
    return this.getAsync(query, [])
  }

  // Tested
  async getWorksEndedThisMonth() {
    var query = 'SELECT COUNT(1) AS Count ' +
      'FROM Trabajos t ' +
      'WHERE FechaTerminacion >= date("now", "localtime", "start of month") ' +
      'AND FechaTerminacion <= date("now", "localtime")'
    return this.getAsync(query, [])
  }

  // Tested
  async getWorksEndedLast30days() {
    var query = 'SELECT COUNT(1) AS Count, ROUND(SUM(PrecioConDescuento), 2) AS Sum ' +
      'FROM Trabajos ' +
      'WHERE FechaTerminacion >= date("now", "localtime", "-30 days")'
    return this.getAsync(query, [])
  }

  // Tested
  async getWorksEndedPrevious30days() {
    var query = 'SELECT COUNT(1) AS Count, ROUND(SUM(PrecioConDescuento), 2) AS Sum ' +
      'FROM Trabajos ' +
      'WHERE FechaTerminacion >= date("now", "localtime", "-60 days") ' +
      'AND FechaTerminacion <= date("now", "localtime", "-30 days")'
    return this.getAsync(query, [])
  }

  // Tested
  async getMonthTotals() {
    var query = 'SELECT strftime("%m", FechaTerminacion) AS Month, ' +
      'strftime("%Y", FechaTerminacion) AS Year, ROUND(SUM(PrecioConDescuento), 2) AS Sum ' +
      'FROM Trabajos ' +
      'WHERE FechaTerminacion IS NOT NULL AND FechaTerminacion != "" ' +
      'GROUP BY Month, Year'
    var data = await this.allAsync(query, [])
    var thisYearData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    var previousYearData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    _.forEach(_.filter(data, ['Year', new Date().getFullYear().toString()]), (v) => {
      thisYearData[parseInt(v.Month) - 1] = parseFloat(v.Sum).toFixed(2)
    })
    _.forEach(_.filter(data, ['Year', (new Date().getFullYear() - 1).toString()]), (v) => {
      previousYearData[parseInt(v.Month) - 1] = parseFloat(v.Sum).toFixed(2)
    })
    return {
      thisYear: thisYearData,
      lastYear: previousYearData
    }
  }

  // Tested
  async getMonthTotalsPerDentist(dentistId) {
    var query = 'SELECT strftime("%m", FechaTerminacion) AS Month, ' +
      'strftime("%Y", FechaTerminacion) AS Year, SUM(PrecioConDescuento) AS Sum ' +
      'FROM Trabajos ' +
      'WHERE FechaTerminacion IS NOT NULL AND FechaTerminacion != "" AND IdDentista = ? ' +
      'GROUP BY Month, Year'
    var data = await this.allAsync(query, [dentistId])
    var thisYearData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    var previousYearData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    _.forEach(_.filter(data, ['Year', new Date().getFullYear().toString()]), (v) => {
      thisYearData[parseInt(v.Month) - 1] = parseFloat(v.Sum).toFixed(2)
    })
    _.forEach(_.filter(data, ['Year', (new Date().getFullYear() - 1).toString()]), (v) => {
      previousYearData[parseInt(v.Month) - 1] = parseFloat(v.Sum).toFixed(2)
    })
    return {
      thisYear: thisYearData,
      lastYear: previousYearData
    }
  }

  async getSumPerDentistPerWorkType(dentistId) {
    var query = 'SELECT tt.Descripcion AS TipoTrabajo, ' +
      'ROUND(SUM(PrecioConDescuento), 2) AS Sum ' +
      'FROM Trabajos t ' +
      'INNER JOIN TipoTrabajos tt ON t.IdTipoTrabajo = tt.IdTipoTrabajo ' +
      'WHERE FechaTerminacion IS NOT NULL AND FechaTerminacion != "" AND IdDentista = ? ' +
      'GROUP BY TipoTrabajo'
    var data = await this.allAsync(query, [dentistId])
    return {
      labels: _.map(data, (e) => {
        return e.TipoTrabajo
      }),
      data: _.map(data, (e) => {
        return e.Sum
      })
    }
  }

  // Tested
  async getLeaderboard(limit) {
    var query = 'SELECT d.NombreDentista, ' +
      'ROUND(SUM(t.PrecioConDescuento), 2) AS Sum ' +
      'FROM Trabajos t ' +
      'INNER JOIN Dentistas d ON d.IdDentista = t.IdDentista ' +
      'WHERE FechaTerminacion >= date("now", "localtime", "-1 year") ' +
      'GROUP BY d.NombreDentista ' +
      'ORDER BY Sum DESC '
    if (limit !== undefined) {
      query += 'LIMIT ' + limit
    }

    return this.allAsync(query, [])
  }
}