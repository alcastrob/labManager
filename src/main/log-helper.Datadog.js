import {
	datadogLogs
} from '@datadog/browser-logs'

export function remoteLogDatadog(logger, options) {
	try {
		if (!logger || !logger.methodFactory) {
			throw new Error('loglevel instance has to be specified in order to be extended')
		}

		var _logger = logger
		var _callOriginal = (options && options.callOriginal) || false
		var _originalFactory = _logger.methodFactory

		logger.methodFactory = function (methodName, logLevel) {
			var rawMethod = _originalFactory(methodName, logLevel)

			var payload = {
				clientTimestamp: new Date().toISOString(),
				host: options.host,
				version: options.version,
				system: options.system
			}
			switch (methodName) {
				case 'trace':
				case 'debug':
					return function (message) {
						try {
							datadogLogs.logger.debug(message, payload)

							if (_callOriginal) {
								rawMethod(options)
							}
						} catch (err) {
							console.log('Error: ', err)
						}
					}
				case 'info':
					return function (message) {
						try {
							datadogLogs.logger.info(message, payload)

							if (_callOriginal) {
								rawMethod(options)
							}
						} catch (err) {
							console.log('Error: ', err)
						}
					}
				case 'warn':
					return function (message) {
						try {
							datadogLogs.logger.warn(message, payload)

							if (_callOriginal) {
								rawMethod(options)
							}
						} catch (err) {
							console.log('Error: ', err)
						}
					}
				case 'error':
					return function (message) {
						try {
							datadogLogs.logger.error(message, payload)

							if (_callOriginal) {
								rawMethod(options)
							}
						} catch (err) {
							console.log('Error: ', err)
						}
					}
				default:
					console.log(`LogLevel not supported: ${methodName}`)
			}
		}
	} catch (err) {
		console.log('Error: ', err)
	}
}