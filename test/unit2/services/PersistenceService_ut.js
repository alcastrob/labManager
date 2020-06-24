import GoogleDriveService from '../../../src/services/GoogleDriveService'

// var assert = require('assert')
// var should = require('should')

describe('PersistenceService', function () {
	describe('constructor', function () {
		it('should return -1 when the value is not present', function () {
			// Assume
			var service = new GoogleDriveService()

			// Act

			// Assert
			service.should.have.property('configFileService')
		})
	})
})