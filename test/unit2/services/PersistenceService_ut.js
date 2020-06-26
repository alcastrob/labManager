import PersistenceService from '../../../src/services/PersistenceService'

var assert = require('assert')
var should = require('should')

describe('PersistenceService', function () {
	describe('constructor', function () {
		it('should return -1 when the value is not present', function () {
			// Assume
			var service = new PersistenceService()

			// Act

			// Assert
			service.should.have.property('configFileService')
		})
	})
})