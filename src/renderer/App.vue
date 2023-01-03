<template>
  <div id="page-top">
    <topbar ref="topBar"></topbar>
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
</template>

<script>
import 'jquery/dist/jquery.min.js'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'chart.js/dist/Chart.min.js'
import 'dropzone/dist/min/dropzone.min.js'
import Vue from 'vue'
import VueSwal from 'vue-swal'
import VueToasted from 'vue-toasted'
import topbar from './components/PageElements/TopBar'
import { checkForUpdates } from '../main/updates'
import PersistenceService from '../services/PersistenceService'
import ConfigFileService from '../services/ConfigFileService'
import { webFrame } from 'electron'
import log from 'loglevel'
var { ipcRenderer } = require('electron')

const UPDATE_INTERVAL = 3 * 60 * 60 * 1000

Vue.use(VueSwal)
Vue.use(VueToasted, { iconPack: 'fontawesome', singleton: true })

export default {
  name: 'labManager',
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
				if (!dataFile || dataFile === '.') {
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
					return
				}
				await this.loadSpecificDBFile(dataFile)
			} catch (err) {
				log.error(`Error in loadDb method of ${this.$vnode.componentOptions.tag}. Content: ${JSON.stringify(err)}`)
			}
		},
		loadSpecificDBFile: async function(dataFile) {
			try {
				var db = await this.persistenceService.loadDbFile(dataFile)
				if (!db) {
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
					// this.configFileService.configSet('dataFile', '')
				}
				this.$router.push({
					path: '/'
				})
			} catch (err) {
				log.error(
					`Error in loadSpecificDBFile method of ${this.$vnode.componentOptions.tag}. Content: ${JSON.stringify(err)}`
				)
			}
		},
		reloadDb: async function(file) {
			if (file) {
				this.configFileService.configSet('dataFile', file)
				await this.loadDb()
			}
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
		},
		setZoomLevel(delta, value) {
			if (value) {
				this.currentZoomLevel = value
			} else {
				if (this.currentZoomLevel > 0.2 && this.currentZoomLevel < 2 && delta) {
					this.currentZoomLevel += delta
				}
			}

			webFrame.setZoomFactor(this.currentZoomLevel)
			this.configFileService.configSet('zoomLevel', this.currentZoomLevel)
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

    ipcRenderer.on('reload:database', (event, options) => {
      console.log('recibido reload:database')
      debugger
			this.reloadDb(options.filePath)
			this.configFileService.configSet('readonly', options.readOnly)
		})
		this.currentZoomLevel = this.configFileService.configGet('zoomLevel')
		if (!this.currentZoomLevel) {
			this.currentZoomLevel = 1
		}
		this.setZoomLevel(null, this.currentZoomLevel)

		ipcRenderer.on('zoomlevel:up', () => {
			this.setZoomLevel(0.1)
		})
		ipcRenderer.on('zoomlevel:down', () => {
			this.setZoomLevel(-0.1)
		})
		ipcRenderer.on('zoomlevel:reset', () => {
			this.setZoomLevel(null, 1)
		})
	}
}
</script>

<style>
  /* Bootstrap */
  @import url('~@/assets/css/bootstrap/css/bootstrap.min.css');
  /* Custom fonts for this template */
  @import url('~@/assets/css/fontawesome-free/css/all.min.css');
  /* Page level plugin CSS */
  @import url('~@/assets/css/datatables/datatables.bootstrap4.min.css');
  /* Custom styles for this template */
  @import url('~@/assets/css/sb-admin.css');
  @import url('~@/assets/css/nunito/nunito.css');
  @import url('~@/assets/css/animate/animate.min.css');
  @import url('~@/assets/css/bootstrap-vue.min.css');
  @import url('~@/assets/css/dropzone.min.css');

  body {
    background-color: #E4DFDA;
    color: #150626;
    font-family: 'Nunito', sans-serif;
  }
  #content-wrapper {
    padding-top: 60px !important;
  }
  .btn-warning {
    background-color: #D4B483;
    border-color: #D4B483;
  }
  .bg-dark {
    background-color: #4A4D4F!important;
  }
  table.table-bordered tr th {
    background-color:#AFA8A1;
  }
  table.table-bordered tr th:hover {
    background-color:#AFA8A1;
    color: #fff!important;
  }
  table.table-bordered tfoot tr td {
    background-color:#AFA8A1;
  }
  table.table-bordered tr:nth-child(odd) {
    background-color: #F2ECE6;
  }
  table.table-bordered tr:nth-child(even) {
    background-color: #FFF6ED;
  }

  .deaggregated {
    background-color: #FBC2B5!important;
  }
  table.table-bordered tr.deaggregated:hover {
    background-color:#DDAB9F!important;
  }

  table.table-bordered tr:not(.deaggregated):hover td {
    background-color:#DDD8D2;
  }
  table.table-bordered th,
  table.table-bordered td {
    border: 1px solid #454849;
  }
  table.table-bordered i {
    display:none;
  }
  table.table-bordered tr:hover > td >  i {
    display:block;
  }
  .pagination>li>a,
  .pagination>li>span
  .pagination>li.disabled>a {
    border: 1px solid #AFA8A1!important;
    color: #150626;
  }
  .pagination>li.active>a {
    background: #AFA8A1!important;
    color: #fff;
  }

  .swal-button {
    display: inline-block;
    font-weight: 400;
    text-align: center;
    white-space: nowrap;
    vertical-align: middle;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    border: 1px solid transparent;
    box-shadow: none;
    border-radius: .25rem;
    padding: .375rem .75rem;
    font-size: 1rem;
    line-height: 1.5;
    transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;
    cursor: pointer;
}
.swal-button--ok {
  background-color: #6c757d;
  border-color: #6c757d;
}
.swal-button:focus {
  outline: none;
  box-shadow: none;
}

.noOverflow {
  overflow-x: hidden;
}
.visuallyhidden:not(:focus):not(:active) {
  position: absolute;

  width: 1px;
  height: 1px;
  margin: -1px;
  border: 0;
  padding: 0;

  white-space: nowrap;

  clip-path: inset(100%);
  clip: rect(0 0 0 0);
  overflow: hidden;
}
.displayNone {
    display: none;
}

.separated-column {
  border-left: 1px solid #CDC8CA;
}

</style>
