'use strict'

import log from 'loglevel'
import PersistenceService from './PersistenceService'

export default class WorkService extends PersistenceService {
	// Tested
	async getWorksList(customFilters) {
		var query = 'SELECT * FROM vTrabajos WHERE 1=1'
		if (customFilters) {
			if (customFilters.fEntrada) {
				query += this.processDateQuery('FechaEntrada', customFilters.fEntrada)
			}
			if (customFilters.fPrevista) {
				query += this.processDateQuery('FechaPrevista', customFilters.fPrevista)
			}
			if (customFilters.fSalida) {
				query += this.processDateQuery('FechaTerminacion', customFilters.fSalida)
			}
			if (customFilters.tipo && customFilters.tipo.length > 0) {
				query += this.processTypeQuery('TipoTrabajo', customFilters.tipo)
			}
			if (customFilters.IdDentista) {
				query += ` AND IdDentista = ${customFilters.IdDentista}`
			}
		}

		return this.allAsync(query, [])
	}

	// Tested
	async getWork(workId) {
		var query = 'SELECT * FROM vTrabajos ' + 'WHERE IdTrabajo = ?'
		return this.getAsync(query, [workId])
	}

	// Tested
	async insertWork(work) {
		var query =
			'INSERT INTO Trabajos (IdDentista, IdTipoTrabajo, ' +
			'Paciente, Color, FechaTerminacion, FechaEntrada, ' +
			'FechaPrevista, FechaPrevistaPrueba, PrecioFinal, PrecioMetal, PorcentajeDescuento, TotalDescuento) ' +
			'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
		var id = await this.runAsync(query, [
			work.IdDentista,
			work.IdTipoTrabajo,
			work.Paciente,
			work.Color,
			work.FechaTerminacion,
			work.FechaEntrada,
			work.FechaPrevista,
			work.FechaPrevistaPrueba,
			work.PrecioFinal,
			work.PrecioMetal,
			work.PorcentajeDescuento,
			work.TotalDescuento
		])
		log.info(`Created the work ${id}`)
		if (work.PrecioFinal === null || work.PrecioFinal === undefined) {
			log.error(`Inserted work ${id} has the PrecioFinal empty`)
		}
		return id
	}

	// Tested
	async updateWork(work) {
		var query =
			'UPDATE Trabajos SET IdDentista = ?, IdTipoTrabajo = ?, ' +
			'Paciente = ?, Color = ?, FechaTerminacion = ?, ' +
			'FechaEntrada = ?, FechaPrevista = ?, FechaPrevistaPrueba = ?, ' +
			'PrecioMetal = ?, Nombre = ?, PorcentajeDescuento = ?, ' +
			'TotalDescuento = ?, PrecioFinal = ? ' +
			'WHERE IdTrabajo = ?'
		log.info(`Updating the work ${work.IdTrabajo}`)
		if (work.PrecioFinal === null || work.PrecioFinal === undefined) {
			log.error(`Updated work ${work.IdTrabajo} has the PrecioFinal empty`)
		}
		return this.runAsync(query, [
			work.IdDentista,
			work.IdTipoTrabajo,
			work.Paciente,
			work.Color,
			work.FechaTerminacion,
			work.FechaEntrada,
			work.FechaPrevista,
			work.FechaPrevistaPrueba,
			work.PrecioMetal,
			work.Nombre,
			work.PorcentajeDescuento,
			work.TotalDescuento,
			work.PrecioFinal,
			work.IdTrabajo
		])
	}

	async updateWorkDiscount(workId, percentageDiscount, totalDiscount) {
		var query = 'UPDATE Trabajos SET PorcentajeDescuento = ?, ' + 'TotalDescuento = ? ' + 'WHERE IdTrabajo = ?'
		log.info(`Updating the discounts of work ${workId}`)
		return this.runAsync(query, [percentageDiscount, totalDiscount, workId])
	}

	// Tested
	async getWorkTypes() {
		var query = 'SELECT IdTipoTrabajo, Descripcion FROM TipoTrabajos'

		return this.allAsync(query, [])
	}
}
