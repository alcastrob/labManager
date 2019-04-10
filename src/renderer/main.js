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
	Vue.config.productionTip = false
	Vue.config.errorHandler = function (err, vm, info) {
		log.error('[Global Error Handler]: Error in ' + info + ': ' + err)
	}

	remoteLog(log, {
		url: 'http://104.248.82.4:5000',
		prefix: (severity, message) => {
			return `[${new Date().toISOString()}]${severity}@${require('os').hostname()}(${
				require('../../package.json').version
			}): ${message}`
		},
		callOriginal: true
	})
	log.setLevel('DEBUG')
	window.onerror = (error, url, line) => {
		console.log('onerror')
		log.error(`Application error: ${JSON.stringify(error)}. Url: ${url}. Line: ${line}`)
	}

	/* eslint-disable no-new */
	new Vue({
		components: {
			App
		},
		router,
		store,
		template: '<App/>'
	}).$mount('#app')
} catch (err) {
	log.error(`Error in application. ${JSON.stringify(err)}`)
}