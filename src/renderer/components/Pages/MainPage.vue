<template>
<div id="page-top">
    <topbar />
    <div class="mt-5">
      <div id="wrapper">
        <div id="content-wrapper">
          <div class="container-fluid">
            <dashboard v-if="currentPage === 'dashboard'" />
            <workNew v-if="currentPage === 'workNew'" />
            <worksList v-if="currentPage === 'worksList'" />
            <workDetail v-if="currentPage === 'workDetail'" :workId="currentId" />
            <dentistsList v-if="currentPage === 'dentistsList'"/>
            <dentistDetail v-if="currentPage === 'dentistDetail'" :dentistId="currentId" />
            <dentistNew v-if="currentPage === 'dentistNew'" />
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
import workNew from './WorkNew'
import dentistDetail from './DentistDetail'
import dentistsList from './DentistsList'
import dentistNew from './DentistNew'
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
    workNew,
    worksList,
    dentistDetail,
    dentistsList,
    dentistNew,
    invoices
  },
  data () {
    return {
      currentPage: 'dashboard',
      currentId: null,
      previousPage: null,
      canNavigateBack: false,
      backStates: []
    }
  },
  methods: {
    // Navigation methods---------
    navigateTo: function (pageName, eventData) {
      if (pageName === 'back') {
        var tmp = this.currentPage
        this.currentPage = this.previousPage
        this.previousPage = tmp
        this.canNavigateBack = false
        var state = this.backStates.pop()
        this.$root.$emit('table:setState:' + state.component, state)
      } else if(pageName !== this.currentPage) {
        this.previousPage = this.currentPage
        this.currentPage = pageName
        this.canNavigateBack = this.evaluateCanNavigateBack()
        // I can't figure out how eventData.eventData mutated into eventData.id for Works. In Dentists it still remains as eventData
        if (eventData !== undefined && (eventData.id !== undefined || eventData.eventData !== undefined)) {
          this.backStates.push(eventData)
          if (eventData.id !== undefined) {
            this.currentId = eventData.id.index
          } else if (eventData.eventData !== undefined) {
            this.currentId = eventData.eventData.index
          }
        }
      }
    },
    evaluateCanNavigateBack: function () {
      switch (this.currentPage) {
        case 'workDetail': return true
        case 'dentistDetail': return true
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
      this.navigateTo(this.previousPage)
    })
    ipcRenderer.on('navigation:workNew', () => {
      this.navigateTo('workNew')
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
    ipcRenderer.on('navigation:dentistNew', () => {
      this.navigateTo('dentistNew')
    })
    ipcRenderer.on('navigation:invoices', () => {
      this.navigateTo('invoices')
    })
    this.$root.$on('navigation:navigateTo', (data) => {
      this.navigateTo(data.page, data)
    })
  },
  created () { }
}
</script>

<style>
</style>
