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
import { checkForUpdates } from '../../../main/updates'
import PersistenceService from '../../../services/PersistenceService'
import ConfigFileService from '../../../services/ConfigFileService'
import { webFrame } from 'electron'
import log from 'loglevel'
var { ipcRenderer } = require('electron')

const UPDATE_INTERVAL = 3 * 60 * 60 * 1000

/* eslint no-undef: "off" */

export default {
	name: 'mainPage',
	components: {
		topbar
	},
	data() {
		return {
			currentZoomLevel: undefined
		}
	},
	methods: {
		loadDb: async function() {
			try {
				var dataFile = this.configFileService.configGet('dataFile')
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
				} else if (!(await this.persistenceService.loadDbFile())) {
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
					this.configFileService.configSet('dataFile', '')
				}
			} catch (err) {
				log.error(`Error in loadDb method of ${this.$vnode.componentOptions.tag}. Content: ${JSON.stringify(err)}`)
			}
		},
		reloadDb: async function(file) {
			this.configFileService.configSet('dataFile', file)
			await this.loadDb()
			this.$router.push({
				path: '/'
			})
		},
		checkForUpdates: async function() {
			var updates = await checkForUpdates()
			log.info('Checked for updates')
			if (updates.newerVersion) {
				log.info('New version of the application available for download')
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
						this.$router.push({ path: '/about' })
					}
				})
			}
		}
	},
	created() {
		this.persistenceService = new PersistenceService()
		this.configFileService = new ConfigFileService()
		this.configFileService.dumpToLogger()
		this.loadDb()
	},
	mounted() {
		ipcRenderer.on('navigation:navigateTo', (sender, eventData) => {
			this.$router.push({
				path: eventData.page
			})
		})
		setInterval(this.checkForUpdates, UPDATE_INTERVAL)
		ipcRenderer.on('reload:database', (event, file) => {
			this.reloadDb(file)
		})
		this.currentZoomLevel = this.configFileService.configGet('zoomLevel')
		if (!this.currentZoomLevel) {
			this.currentZoomLevel = 1
		}
		webFrame.setZoomLevel(this.currentZoomLevel)

		ipcRenderer.on('zoomlevel:up', () => {
			if (this.currentZoomLevel < 5) {
				this.currentZoomLevel += 0.1
			}
			webFrame.setZoomFactor(this.currentZoomLevel)
			this.configFileService.configSet('zoomLevel', this.currentZoomLevel)
		})
		ipcRenderer.on('zoomlevel:down', () => {
			if (this.currentZoomLevel > 0.2) {
				this.currentZoomLevel -= 0.1
			}
			webFrame.setZoomFactor(this.currentZoomLevel)
			this.configFileService.configSet('zoomLevel', this.currentZoomLevel)
		})
		ipcRenderer.on('zoomlevel:reset', () => {
			this.currentZoomLevel = 1
			webFrame.setZoomFactor(this.currentZoomLevel)
			this.configFileService.configSet('zoomLevel', this.currentZoomLevel)
		})
	}
}
</script>

<style>
</style>
