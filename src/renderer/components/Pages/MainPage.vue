<template>
<div id="page-top">
    <topbar />
    <div class="mt-3">
      <div id="wrapper">
        <div id="content-wrapper">
          <div class="container-fluid">
            <router-view></router-view>
          </div>
        </div>
      </div>
    </div>
</div>
</template>

<script>
import topbar from '../PageElements/TopBar'
import VueRouter from 'vue-router'
var {ipcRenderer} = require('electron')

export default {
  name: 'mainPage',
  components: {
    topbar
  },
  data () {
    return {
      currentPage: 'dashboard',
    }
  },
  mounted () {
    ipcRenderer.on('navigation:navigateTo', (sender, eventData) => {
      this.$router.push({
        path: eventData.page
      })
    })
  }
}
</script>

<style>
</style>
