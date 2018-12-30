import Vue from 'vue'
import axios from 'axios'
import Notifications from 'vue-notification'

import App from './App'
import router from './router'
import store from './store'
import moment from 'moment'
import BootstrapVue from 'bootstrap-vue'
import Vuelidate from 'vuelidate'

Vue.filter('formatDateDMY', function (value) {
  if (value) {
    return moment(String(value)).format('DD/MM/YYYY')
  }
})

Vue.use(Notifications)
Vue.use(BootstrapVue)
Vue.use(Vuelidate)
// Vue.use(window.vuelidate.default)
// const { required, minLength } = window.validators

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.http = Vue.prototype.$http = axios
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
