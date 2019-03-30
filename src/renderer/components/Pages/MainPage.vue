<template>
  <div id="page-top">
    <topbar ref="topBar"></topbar>
    <div class="mt-3">
      <div id="wrapper">
        <div id="content-wrapper">
          <div class="container-fluid">
            <keep-alive
              exclude="workNew,workDetail,dentistDetail,worksListUncached,invoice,monthCheck,about,products,catalog,dashboard"
            >
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
import { loadDbFile } from '../../../main/dal.js'
import { configGet, configSet } from '../../../main/store'
import { checkForUpdates } from '../../../main/updates'
import log from 'loglevel'
var { ipcRenderer } = require('electron')

const UPDATE_INTERVAL = 3 * 60 * 60 * 1000

/* eslint no-undef: "off" */

export default {
	name: 'mainPage',
	components: {
		topbar
	},
	methods: {
		loadDb: async function() {
			var dataFile = configGet('dataFile')
			if (!dataFile) {
				// No selected file for running the application
				swal({
					title: 'Datos no cargados',
					text:
						'La aplicación debe cargar un fichero de datos para poder trabajar correctamente. Por favor, seleccione el fichero apropiado en el menú Archivo > Abrir archivo.',
					icon: 'error',
					buttons: {
						ok: 'OK'
					}
				})
				log.warn('No data file selected')
			} else if (!(await loadDbFile())) {
				// Something went wrong with that file
				swal({
					title: 'Fichero no reconocido',
					text:
						'El fichero que se ha seleccionado no tiene un formato válido para la aplicación. Por favor, seleccione otro.',
					icon: 'error',
					buttons: {
						ok: 'OK'
					}
				})
				log.warn('No valid format for the database file.')
				configSet('dataFile', '')
			} else {
				// Everything is OK
			}
		},
		reloadDb: async function(file) {
			configSet('dataFile', file)
			await this.loadDb()
			log.info(`>> navigate: /..`)
			this.$router.push({
				path: '/'
			})
		},
		checkForUpdates: async function() {
			var updates = await checkForUpdates()
			if (updates.newerVersion) {
				swal({
					title: 'Actualización disponible',
					text: 'Existe una nueva versión de esta aplicación lista para su descarga e instalación.',
					icon: 'success',
					buttons: {
						cancel: 'Cancelar',
						ok: 'Continuar'
					}
				}).then(value => {
					if (value === 'ok') {
						log.info(`>> navigate: /about`)
						this.$router.push({ path: '/about' })
					}
				})
			}
		}
	},
	created() {
		this.loadDb()
	},
	mounted() {
		ipcRenderer.on('navigation:navigateTo', (sender, eventData) => {
			log.info(`>> navigate: ${eventData.page}`)
			this.$router.push({
				path: eventData.page
			})
		})
		setInterval(this.checkForUpdates(), UPDATE_INTERVAL)
		ipcRenderer.on('reload:database', (event, file) => {
			this.reloadDb(file)
		})
	}
}
</script>

<style>
</style>
