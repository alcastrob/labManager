import Vue from 'vue'
import axios from 'axios'
import Notifications from 'vue-notification'

import App from './App'
import router from './router'
import store from './store'
import BootstrapVue from 'bootstrap-vue'
import Vuelidate from 'vuelidate'

Vue.use(Notifications)
Vue.use(BootstrapVue)
Vue.use(Vuelidate)

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
