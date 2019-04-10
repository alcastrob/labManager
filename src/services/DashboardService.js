// eslint-disable-next-line no-unused-expressions
'use strict'

import PersistenceService from './PersistenceService'

export default class DashboardService extends PersistenceService {
  // Tested
  async getWaitingInbound() {
    var query = 'SELECT * FROM vDashboard_EsperandoEntrada'
    return this.allAsync(query, [])
  }

  // Tested
  async getOutboundingTests() {
    var query = 'SELECT * FROM vDashboard_PruebasSalenHoy'
    return this.allAsync(query, [])
  }

  // Tested
  async getOutboundingWorks() {
    var query = 'SELECT * FROM vDashboard_TrabajosSalenHoy'
    return this.allAsync(query, [])
  }
}