<template>
<div id="page-top">
    <topbar />
    <div class="mt-3">
      <div id="wrapper">
        <div id="content-wrapper">
          <div class="container-fluid">
            <keep-alive exclude="workNew,workDetail,dentistDetail,worksListUncached,finances,monthCheck">
              <router-view></router-view>
            </keep-alive>
          </div>
        </div>
      </div>
    </div>
</div>
</template>

<script>
import topbar from '../PageElements/TopBar'
import VueRouter from 'vue-router'
import { loadDbFile } from '../../../main/dal.js'

var { ipcRenderer } = require('electron')

export default {
  name: 'mainPage',
  components: {
    topbar
  },
  created () {
    loadDbFile()
  },
  mounted () {
    ipcRenderer.on('navigation:navigateTo', (sender, eventData) => {
      this.$router.push({
        path: eventData.page
      })
    })
    ipcRenderer.on('update:available', (sender, updateInfo) => {
      swal({
        title: "Actualización disponible",
        text: "Existe una nueva versión de esta aplicación lista para su descarga e instalación.",
        icon: "success",
        buttons: {
          cancel: 'Cancelar',
          ok: 'Continuar'
        }
      }).then((value) =>{
        if (value === 'ok') {
          this.$router.push({ path: '/about' })
        }
      })
    })
  }
}
</script>

<style>
</style>
