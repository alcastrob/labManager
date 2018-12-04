<template>
<div id="page-top">
    <topbar />
    <div id="wrapper">
      <div id="content-wrapper">
        <div class="container-fluid">
          <dashboard/>

        </div>
      </div>
    </div>
</div>
</template>

<script>
import dashboard from './dashboard'
import topbar from '../PageElements/TopBar'

var {ipcRenderer} = require('electron')

export default {
  name: 'mainPage',
  components: {
    dashboard,
    topbar
  },
  data () {
    return {}
  },
  methods: { },
  mounted () {
    ipcRenderer.on('menu:about', (event) => {
      console.log('Message received')
    })
  }
}
</script>

<style>
</style>
