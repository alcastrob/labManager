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

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false
remoteLog(log, {
  url: 'http://localhost:5000',
  prefix: (severity, message) => {
    return `[${new Date().toISOString()}]${severity}@${require('os').hostname()}: ${message}`
  },
  callOriginal: true
})
log.setLevel('DEBUG')

/* eslint-disable no-new */
new Vue({
  components: {
    App
  },
  router,
  store,
  template: '<App/>'
}).$mount('#app')