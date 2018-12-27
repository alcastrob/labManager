import Vue from 'vue'
import Router from 'vue-router'

import about from '../components/Pages/About.vue'
import mainPage from '../components/Pages/MainPage.vue'
import worksNew from '../components/Pages/WorkNew.vue'
import worksList from '../components/Pages/WorksList.vue'
import workDetail from '../components/Pages/WorkDetail.vue'
import dentistsList from '../components/Pages/DentistsList.vue'
import dentistDetails from '../components/Pages/DentistDetail.vue'
import finances from '../components/Pages/Finances.vue'
import dashboard from '../components/Pages/Dashboard.vue'
import dentistNew from '../components/Pages/DentistNew.vue'

Vue.use(Router)

export default new Router({
  //mode: 'history',
  routes: [
    {
      path: '/',
      component: mainPage,
      children: [
        {
          path: '',
          component: dashboard
        },
        {
          path: 'about',
          component: about
        },
        {
          path: 'works/new',
          component: worksNew
        },
        {
          path: 'works/list',
          component: worksList
        },
        {
          path: 'works/details/:id',
          component: workDetail
        },
        {
          path: 'dentists/list',
          component: dentistsList
        },
        {
          path: 'dentists/details/:id',
          component: dentistDetails
        },
        {
          path: 'dentists/new',
          component: dentistNew
        },
        {
          path: 'finances',
          component: finances
        }
      ]
    }
  ],
  scrollBehavior (to, from, savedPosition) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(savedPosition)
      }, 50)
    })
  }
})
