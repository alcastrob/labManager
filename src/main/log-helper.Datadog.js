import axios from 'axios'
import secrets from '../../secrets'

export async function remoteLogDatadog(logger) {
	try {
		if (!logger || !logger.methodFactory) {
			throw new Error('loglevel instance has to be specified in order to be extended')
		}

		logger.methodFactory = function (methodName, logLevel) {
			return function (message) {
				var payload = {
					message: message,
					status: methodName,
					host: require('os').hostname(),
					version: require('../../package.json').version,
					system: 'labManager'
				}

				axios.post(`https://http-intake.logs.datadoghq.eu/v1/input/${secrets.datadogApiToken}`, payload).catch(error => {
					console.error('Failed to call to datadog with this payload', payload)
					console.error(error)
					throw error
				})
			}
		}
	} catch (err) {
		console.log('Error: ', err)
	}
}