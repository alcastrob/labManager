// eslint-disable-next-line no-unused-expressions
'use strict'

import log from 'loglevel'
import PersistenceService from './PersistenceService'

export default class MonthCheckService extends PersistenceService {
  // Tested
  async getWorksAggregatedByDentist(year, month, readOnly) {
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
      '    sum(CASE WHEN t.IdTipoTrabajo = "2" THEN t.PrecioFinal ELSE 0 END) + ' +
      '    sum(CASE WHEN t.IdTipoTrabajo = "3" THEN t.PrecioFinal ELSE 0 END) + ' +
      '    sum(CASE WHEN t.IdTipoTrabajo = "4" THEN t.PrecioFinal ELSE 0 END) + ' +
      '    sum(CASE WHEN t.IdTipoTrabajo = "5" THEN t.PrecioFinal ELSE 0 END) - ' +
      '    ifnull(sum(t.PrecioMetal), 0) AS SumaTotalMetal, ' +
      '  CAST((sum(t.TotalDescuento) * 100) AS FLOAT) / ' +
      '    (sum(CASE WHEN t.IdTipoTrabajo = "1" THEN t.PrecioFinal ELSE 0 END) + ' +
      '     sum(CASE WHEN t.IdTipoTrabajo = "2" THEN t.PrecioFinal ELSE 0 END) + ' +
      '     sum(CASE WHEN t.IdTipoTrabajo = "3" THEN t.PrecioFinal ELSE 0 END) + ' +
      '     sum(CASE WHEN t.IdTipoTrabajo = "4" THEN t.PrecioFinal ELSE 0 END) + ' +
      '     sum(CASE WHEN t.IdTipoTrabajo = "5" THEN t.PrecioFinal ELSE 0 END) - ' +
      '     ifnull(sum(t.PrecioMetal), 0)) as percentage, ' +
      ' sum(t.TotalDescuento) as SumaDescuento, ' +
      ' ifnull(sum(t.PrecioMetal), 0) + ' +
      '   sum(CASE WHEN t.IdTipoTrabajo = "1" THEN t.PrecioFinal ELSE 0 END) + ' +
      '   sum(CASE WHEN t.IdTipoTrabajo = "2" THEN t.PrecioFinal ELSE 0 END) + ' +
      '   sum(CASE WHEN t.IdTipoTrabajo = "3" THEN t.PrecioFinal ELSE 0 END) + ' +
      '   sum(CASE WHEN t.IdTipoTrabajo = "4" THEN t.PrecioFinal ELSE 0 END) + ' +
      '   sum(CASE WHEN t.IdTipoTrabajo = "5" THEN t.PrecioFinal ELSE 0 END) -  ' +
      '   ifnull(sum(t.PrecioMetal), 0) - ' +
      '   sum(t.TotalDescuento) AS SumaGranTotal ' +
      'FROM Trabajos t ' +
      'INNER JOIN Dentistas d ON d.IdDentista = t.IdDentista '

    if (!readOnly) {
      query += 'LEFT JOIN FacturasTrabajos ft ON ft.IdTrabajo = t.IdTrabajo '
    }

    query += 'WHERE t.FechaTerminacion BETWEEN date("' + year + '-' + ('00' + month).substr(-2) + '-01") AND date("' + year + '-' + ('00' + month).substr(-2) + '-01", "+1 month", "-1 day") '
    if (!readOnly) {
      query += 'AND ft.IdFactura IS NULL '
    }
    query += 'GROUP BY t.IdDentista, d.NombreDentista ' +
      'ORDER BY d.NombreDentista'
    log.debug(`getWorksAggregatedByDentist query: ${query}`)
    return this.allAsync(query, [])
  }

  // Tested
  async getWorksDeaggregatedByDentist(year, month, idDentist, isReadOnly = false) {
    var sMonth = ('00' + month).substr(-2)
    if (!isReadOnly) {
      var query = 'SELECT * FROM vTrabajosPorDentista WHERE ' +
        'FechaTerminacion BETWEEN date("' + year + '-' + sMonth + '-01") AND date("' + year + '-' + sMonth + '-01", "+1 month", "-1 day") ' +
        'AND IdDentista = ' + idDentist
      log.debug(`getWorksDeaggregatedByDentist query: ${query}`)
      return this.allAsync(query, [])
    } else {
      var query = 'SELECT * FROM vTodosTrabajosPorDentista WHERE ' +
        'FechaTerminacion BETWEEN date("' + year + '-' + sMonth + '-01") AND date("' + year + '-' + sMonth + '-01", "+1 month", "-1 day") ' +
        'AND IdDentista = ' + idDentist
      log.debug(`getWorksDeaggregatedByDentist query: ${query}`)
      return this.allAsync(query, [])
    }
  }

  // Tested
  async setCheckToWork(idTrabajo, check) {
    var query = 'INSERT OR REPLACE INTO TrabajosChequeados (IdTrabajo, Chequeado) VALUES (?, ?)'
    return this.runAsync(query, [idTrabajo, check ? 1 : 0])
  }
}