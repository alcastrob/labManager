import Vue from 'vue'
import axios from 'axios'
import App from './App'
import router from './router'
import store from './store'
import BootstrapVue from 'bootstrap-vue'
import Vuelidate from 'vuelidate'
import log from 'loglevel'
import {
	remoteLogDatadog
} from '../main/log-helper.Datadog'
import {
	remoteLogLogstash
} from '../main/log-helper.Logstash'
import {
	datadogLogs
} from '@datadog/browser-logs'

Vue.use(BootstrapVue)
Vue.use(Vuelidate)

try {
	if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
	Vue.http = Vue.prototype.$http = axios
	Vue.config.productionTip = true
	Vue.config.errorHandler = function (err, vm, info) {
		log.error('[Global Error Handler]: Error in ' + info + ': ' + err)
	}

	datadogLogs.init({
		clientToken: 'pubb8287858b4d94cab0397667111d5f116',
		datacenter: 'eu',
		forwardErrorsToLogs: true,
		sampleRate: 100
	})

	// remoteLogLogstash(log, {
	// 	url: 'http://telemetry.labmanager.es:5000',
	// 	prefix: (severity, message) => {
	// 		return `[${new Date().toISOString()}]${severity}@${require('os').hostname()}(${
	// 			require('../../package.json').version
	// 		}): ${message}`
	// 	},
	// 	callOriginal: true
	// })

	remoteLogDatadog(log, {
		callOriginal: true,
		host: require('os').hostname(),
		version: require('../../package.json').version,
		system: 'labManager'
	})
	log.setLevel('INFO')
	window.onerror = (error) => {
		log.error(`Application error: ${JSON.stringify(error)}. Url: ${window.url}. Call stack: ${error.stack}`)
	}

	Vue.config.errorHandler = error => {
		log.error(`Application error: ${error.message}. Call stack: ${error.stack}`)
	}

	new Vue({
		router,
		store,
		template: '<App/>',
		components: {
			App
		}
	}).$mount('#app')
} catch (err) {
	log.error(`Error in application. ${JSON.stringify(err)}`)
}