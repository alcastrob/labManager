<template>
<div id="page-top">
    <topbar />
    <div id="wrapper">
      <div id="content-wrapper">
        <div class="container-fluid">
          <dashboard v-if="currentPage === 'dashboard'" />
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

var {ipcRenderer} = require('electron')

export default {
  name: 'mainPage',
  components: {
    dashboard,
    about,
    topbar
  },
  data () {
    return {
      currentPage: 'dashboard'
    }
  },
  methods: { },
  mounted () {
    ipcRenderer.on('navigation:about', () => {
      this.currentPage = 'about'
    })
    ipcRenderer.on('navigation:dashboard', () => {
      this.currentPage = 'dashboard'
    })
    ipcRenderer.on('navigation:works', () => {
      this.currentPage = 'works'
    })
    ipcRenderer.on('navigation:dentists', () => {
      this.currentPage = 'dentists'
    })
  }
}
</script>

<style>
</style>
