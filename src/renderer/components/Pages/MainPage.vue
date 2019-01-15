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
import { configGet, configSet } from '../../../main/store'
var { ipcRenderer } = require('electron')

export default {
  name: 'mainPage',
  components: {
    topbar
  },
  methods: {
    loadDb: async function(){
      if (configGet('dataFile') === ''){
        // No selectec file for running the application
        swal({
          title: "Datos nos cargados",
          text: "La aplicación debe cargar un fichero de datos para poder trabajar correctamente. Por favor, seleccione el fichero apropiado en el menú Archivo > Abrir archivo.",
          icon: "error",
          buttons: {
            ok: 'OK'
          }
        })
      } else if (!await loadDbFile()){
        //Something went wrong with that file
        swal({
          title: "Fichero no reconocido",
          text: "El fichero que se ha seleccionado no tiene un formato válido para la aplicación. Por favor, seleccione otro.",
          icon: "error",
          buttons: {
            ok: 'OK'
          }
        })
        configSet('dataFile', '')
      }
    }
  },
  created () {
    this.loadDb()
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
    ipcRenderer.on('reload:database', (event, file) => {
      configSet('dataFile', file)
      this.loadDb()
    })
  }
}
</script>

<style>
</style>
