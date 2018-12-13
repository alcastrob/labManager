<template>
<div id="page-top">
    <topbar />
    <div class="mt-5">
      <div id="wrapper">
        <div id="content-wrapper">
          <div class="container-fluid">
            <dashboard v-if="currentPage === 'dashboard'" />
            <workDetail v-if="currentPage === 'workDetail'" :workId="currentId" />
            <dentistDetail v-if="currentPage === 'dentistDetail'" />
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
import dentistDetail from './DentistDetail'

var {ipcRenderer} = require('electron')

export default {
  name: 'mainPage',
  components: {
    dashboard,
    about,
    topbar,
    workDetail,
    dentistDetail
  },
  data () {
    return {
      currentPage: 'dashboard',
      currentId: null
    }
  },
  methods: {
    navigateTo: function (pageName, id) {
      this.currentPage = pageName
      this.currentId = id
    }
  },
  mounted () {
    ipcRenderer.on('navigation:about', () => {
      this.navigateTo('about')
    })
    ipcRenderer.on('navigation:dashboard', () => {
      this.navigateTo('dashboard')
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
