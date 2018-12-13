<template>
<div id="page-top">
    <topbar />
    <div class="mt-5">
      <div id="wrapper">
        <div id="content-wrapper">
          <div class="container-fluid">
            <dashboard v-if="currentPage === 'dashboard'" />
            <newWork v-if="currentPage === 'newWork'" />
            <worksList v-if="currentPage === 'worksList'" />
            <workDetail v-if="currentPage === 'workDetail'" :workId="currentId" />
            <dentistsList v-if="currentPage === 'dentistsList'" />
            <dentistDetail v-if="currentPage === 'dentistDetail'" />
            <invoices v-if="currentPage === 'invoices'" />
            <about v-if="currentPage === 'about'"/>
          </div>
        </div>
      </div>
    </div>
</div>
</template>

<script>
import dashboard from './dashboard'
import about from './About'
import topbar from '../PageElements/TopBar'
import workDetail from './WorkDetail'
import newWork from './NewWork'
import dentistDetail from './DentistDetail'
import dentistsList from './DentistsList'
import worksList from './WorksList'
import invoices from './Invoices'

var {ipcRenderer} = require('electron')

export default {
  name: 'mainPage',
  components: {
    dashboard,
    about,
    topbar,
    workDetail,
    newWork,
    worksList,
    dentistDetail,
    dentistsList,
    invoices
  },
  data () {
    return {
      currentPage: 'dashboard',
      currentId: null,
      previousPage: null,
      canNavigateBack: false
    }
  },
  methods: {
    navigateTo: function (pageName, id) {
      console.log('Current: ' + this.currentPage)
      console.log('Previous: ' + this.previousPage)
      console.log('Requested: ' + pageName)
      if (pageName === 'back') {
        var tmp = this.currentPage
        this.currentPage = this.previousPage
        this.previousPage = tmp
        this.canNavigateBack = false
      } else {
        this.previousPage = this.currentPage
        this.currentPage = pageName
        this.canNavigateBack = this.evaluateCanNavigateBack()
      }
      this.currentId = id
    },
    evaluateCanNavigateBack: function () {
      switch (this.currentPage) {
        case 'workDetail': return true
        default: return false
      }
    }
  },
  mounted () {
    ipcRenderer.on('navigation:about', () => {
      this.navigateTo('about')
    })
    ipcRenderer.on('navigation:dashboard', () => {
      this.navigateTo('dashboard')
    })
    ipcRenderer.on('navigation:back', () => {
      console.log(this.previousPage)
      this.navigateTo(this.previousPage)
    })
    ipcRenderer.on('navigation:newWork', () => {
      this.navigateTo('newWork')
    })
    ipcRenderer.on('navigation:worksList', () => {
      this.navigateTo('worksList')
    })
    ipcRenderer.on('navigation:workDetail', () => {
      this.navigateTo('workDetail')
    })
    ipcRenderer.on('navigation:dentistsList', () => {
      this.navigateTo('dentistLists')
    })
    ipcRenderer.on('navigation:dentistDetail', () => {
      this.navigateTo('dentistDetail')
    })
    ipcRenderer.on('navigation:invoices', () => {
      this.navigateTo('invoices')
    })
  },
  created () { }
}
</script>

<style>
</style>
