import PersistenceService from '../../../src/services/PersistenceService'
import ConfigFileService from '../../../src/services/ConfigFileService'
const awilix = require('awilix')

// var assert = require('assert')
// var should = require('should')

const container = awilix.createContainer({
	injectionMode: awilix.InjectionMode.PROXY
})

container.register({
	// Here we are telling Awilix how to resolve a
	// userController: by instantiating a class.
	configFileService: awilix.asClass(ConfigFileService)
})

describe('PersistenceService', function () {
	describe('constructor', function () {
		it('should return -1 when the value is not present', function () {
			// Assume
			var service = new PersistenceService(container.resolve(('configFileService')))

			// Act

			// Assert
			service.should.have.property('configFileService')
		})
	})
})