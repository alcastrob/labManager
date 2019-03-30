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
import monthCheck from '../components/Pages/MonthCheck.vue'
import dashboard from '../components/Pages/Dashboard.vue'
import dentistNew from '../components/Pages/DentistNew.vue'
import catalog from '../components/Pages/Catalog.vue'
import products from '../components/Pages/Products.vue'
import invoice from '../components/Pages/Invoice.vue'
import configuration from '../components/Pages/Configuration.vue'

Vue.use(Router)

export default new Router({
  routes: [{
    path: '/',
    component: mainPage,
    children: [{
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
        path: 'works/list/dentist/:id',
        component: worksList
      },
      {
        path: 'works/details/:id',
        component: workDetail
      },
      {
        path: 'dentists/new',
        component: dentistNew
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
        path: 'finances',
        component: finances
      },
      {
        path: 'finances/monthCheck/:year/:month',
        component: monthCheck
      },
      {
        path: 'finances/invoices/:id',
        component: invoice
      },
      {
        path: 'maintenace/catalog',
        component: catalog
      },
      {
        path: 'maintenace/products',
        component: products
      },
      {
        path: 'maintenace/configuration',
        component: configuration
      }
    ]
  }],
  scrollBehavior(to, from, savedPosition) {
    let position = {
      x: 0,
      y: 0
    }
    // Keep scroll position when using browser buttons
    if (savedPosition) {
      position = savedPosition
    }

    // Workaround for transitions scrolling to the top of the page
    // However, there are still some problems being fixed by the vue team
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(position)
      }, 100)
    })
  }
})