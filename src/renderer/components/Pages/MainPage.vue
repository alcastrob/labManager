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
    ipcRenderer.on('menu:about', (event) => {
      console.log('Message received')
      this.currentPage = 'about'
    })
  }
}
</script>

<style>
</style>
