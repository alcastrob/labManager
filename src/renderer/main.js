import Vue from 'vue'
import axios from 'axios'
import App from './App'
import router from './router'
import store from './store'
import BootstrapVue from 'bootstrap-vue'
import Vuelidate from 'vuelidate'
import log from 'loglevel'
import {
	remoteLog
} from '../main/log-helper'

Vue.use(BootstrapVue)
Vue.use(Vuelidate)

try {
	if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
	Vue.http = Vue.prototype.$http = axios
	Vue.config.productionTip = true
	Vue.config.errorHandler = error => {
		log.error(`Application error: ${error.message}. Call stack: ${error.stack}`)
	}

	window.onerror = (message, url, line, col, error) => {
		log.error(`Application error: ${message}. ${JSON.stringify(error)}. Url: ${url}. Line: ${line}`)
	}

	remoteLog(log, {
		url: 'http://telemetry.labmanager.es:5000',
		prefix: (severity, message) => {
			return `[${new Date().toISOString()}]${severity}@${require('os').hostname()}(${
				require('../../package.json').version
			}): ${message}`
		},
		callOriginal: true
	})
	log.setLevel('INFO')

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