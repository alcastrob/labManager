<template>
<div id="page-top">
    <topbar />
    <div id="wrapper">
      <div id="content-wrapper">
        <div class="container-fluid">
          <dashboard v-if="currentPage === 'dashboard'" />
          <workDetail v-if="currentPage === 'workDetail'" />
          <dentistDetail v-if="currentPage === 'dentistDetail'" />
          <about v-if="currentPage === 'about'"/>
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
      currentPage: 'dashboard'
    }
  },
  methods: {
    navigateTo: function (pageName) {
      this.currentPage = pageName
    }
  },
  mounted () {
    ipcRenderer.on('navigation:about', () => {
      this.navigateTo('about')
    })
    ipcRenderer.on('navigation:dashboard', () => {
      debugger
      this.navigateTo('dashboard')
    })
    ipcRenderer.on('navigation:works', () => {
      this.navigateTo('workDetail')
    })
    ipcRenderer.on('navigation:dentistDetail', () => {
      console.log('aaaa')
      this.navigateTo('dentistDetail')
    })
  },
  created () {
    this.$on('send', (text) => {
      console.log('bbb')
    })
    ipcRenderer.on('navigation:dashboard', () => {
      console.log('aaa')
      this.currentPage = 'dashboard'
    })
  }
}
</script>

<style>
</style>
