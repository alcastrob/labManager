import log from 'loglevel'

export function remoteLog(logger, options) {
	if (!logger || !logger.methodFactory) {
		throw new Error('loglevel instance has to be specified in order to be extended')
	}

	// eslint-disable-next-line one-var
	var _logger = logger
	var _url = (options && options.url) || 'http://localhost:8000/main/log'
	var _callOriginal = (options && options.callOriginal) || false
	var _prefix = options && options.prefix
	var _originalFactory = _logger.methodFactory
	var _sendQueue = []
	var _isSending = false

	logger.methodFactory = function(methodName, logLevel) {
		var rawMethod = _originalFactory(methodName, logLevel)

		return function(message) {
			if (typeof _prefix === 'string') {
				message = _prefix + message
			} else if (typeof _prefix === 'function') {
				message = _prefix(methodName, message)
			} else {
				message = methodName + ': ' + message
			}

			_sendQueue.push(message)
			_sendNextMessage()

			if (_callOriginal) {
				rawMethod(message)
			}
		}
	}

	var _sendNextMessage = function() {
		if (!_sendQueue.length || _isSending) {
			return
		}

		_isSending = true

		var msg = _sendQueue.shift()
		var req = new XMLHttpRequest()

		req.open('POST', _url, true)
		req.setRequestHeader('Content-Type', 'text/plain')
		req.onreadystatechange = function() {
			if (req.readyState === 4) {
				_isSending = false
				setTimeout(_sendNextMessage, 0)
			}
		}
		req.send(msg)
	}
}
