<template>
  <div>
    <div class="container">
      <div class="row">
        <div class="col-md-4">
          <h1>Dentista</h1>
        </div>
        <!-- col-md-6 -->
        <div class="col-md-8 mt-2">
          <div class="float-right">
            <div>
              <collapsible-link-button
                iconCss="fas fa-file-invoice-dollar mr-2"
                text="Ver sus facturas"
                :pathTo="getInvoiceListUrl()"
              ></collapsible-link-button>
              <collapsible-link-button
                iconCss="fa fa-fw fa-list"
                text="Ver sus trabajos"
                :pathTo="getWorkListUrl()"
              ></collapsible-link-button>
            </div>
          </div>
        </div>
        <!-- col-md-6 -->
      </div>
      <!-- row -->
      <div class="row">
        <div class="col-md-8" :class="{'col-md-8': isAdmin, 'col-md-12': !isAdmin}">
          <div class="row">
            <div class="col-md-6 mt-3">
              <label for="dentista">Dentista</label>
              <input
                type="text"
                class="form-control"
                id="dentista"
                ref="dentista"
                placeholder="Nombre de el/la dentista"
                v-model="$v.data.NombreDentista.$model"
                :class="{'is-invalid': $v.data.NombreDentista.$error}"
              >
              <small
                class="text-danger"
                v-if="$v.data.NombreDentista.$error"
              >El nombre de el/la dentista no puede estar en blanco</small>
            </div>
            <!-- col-md-6 -->
            <div class="col-md-6 mb-3 mt-3">
              <label for="clinica">Clínica</label>
              <input
                type="text"
                class="form-control"
                id="clinica"
                placeholder="Nombre de la clínica"
                v-model="$v.data.NombreClinica.$model"
                ref="inputClinica"
              >
            </div>
            <!-- col-md-6 -->
          </div>
          <!-- row -->
          <div class="row">
            <div class="col-md-8">
              <h4>Dirección y contacto</h4>
            </div>
          </div>
          <!-- row -->
          <div class="row">
            <div class="col-md-6">
              <label for="calle">Calle</label>
              <textarea
                class="form-control"
                id="calle"
                placeholder="Calle, plaza, avenida..."
                rows="2"
                v-model="$v.data.Direccion.$model"
              ></textarea>
            </div>
            <!-- col-md-6 -->
            <div class="col-md-2">
              <label for="codigoPostal">C. Postal</label>
              <input
                type="text"
                class="form-control"
                id="codigoPostal"
                placeholder="CP"
                v-model="$v.data.CP.$model"
                :class="{'is-invalid': $v.data.CP.$error}"
              >
              <small
                class="text-danger"
                v-if="$v.data.CP.$error"
              >Aunque opcional, se requiere que el código postal sea válido</small>
            </div>
            <!-- col-md-2 -->
            <div class="col-md-4">
              <label for="ciudad">Localidad</label>
              <input
                type="text"
                class="form-control"
                id="ciudad"
                placeholder="Ciudad"
                v-model="$v.data.Poblacion.$model"
              >
            </div>
            <!-- col-md-4 -->
            <div class="col-md-6 mt-3">
              <label for="correoElectronico">Correo electrónico</label>
              <input
                type="text"
                class="form-control"
                id="correoElectronico"
                placeholder="xxx@yyy.zzz"
                v-model="$v.data.CorreoElectronico.$model"
                :class="{'is-invalid': $v.data.CorreoElectronico.$error}"
              >
              <small
                class="text-danger"
                v-if="$v.data.CorreoElectronico.$error"
              >Aunque opcional, se requiere que la dirección sea válida</small>
            </div>
            <!-- col-md-6 -->
            <div class="col-md-3 mt-3">
              <label for="telefono1">Teléfono 1</label>
              <input
                type="text"
                class="form-control"
                id="telefono1"
                placeholder="123 456 789"
                v-model="$v.data.Telefono.$model"
              >
            </div>
            <!-- col-md-3 -->
            <div class="col-md-3 mt-3">
              <label for="telefono2">Teléfono 2</label>
              <input
                type="text"
                class="form-control"
                id="telefono2"
                placeholder="123 456 789"
                v-model="$v.data.Telefono2.$model"
              >
            </div>
            <!-- col-md-3 -->
          </div>
          <!-- row -->

          <div class="row mt-3">
            <div class="col-md-8">
              <h4>Fiscal</h4>
            </div>
          </div>
          <!-- row -->
          <div class="row">
            <div class="col-md-4">
              <label for="datosFiscales">CIF/NIF</label>
              <input
                type="text"
                class="form-control"
                id="datosFiscales"
                placeholder="CIF / NIF"
                v-model="$v.data.DatosFiscales.$model"
              >
            </div>
            <!-- col-md-4 -->
            <div class="col-md-4">
              <label for="datosBancarios">Datos bancarios</label>
              <input
                type="text"
                class="form-control"
                id="datosBancarios"
                placeholder="Número de cuenta"
                v-model="$v.data.DatosBancarios.$model"
              >
            </div>
            <!-- col-md-4 -->
          </div>
          <div class="row mt-3">
            <div class="col-md-8">
              <h4>Otros datos de interés</h4>
            </div>
          </div>
          <!-- row -->
          <div class="row">
            <div class="col-md-12">
              <textarea
                class="form-control"
                id="datosInteres"
                rows="3"
                v-model="$v.data.DatosInteres.$model"
              ></textarea>
              <br>
            </div>
          </div>
          <!-- row -->
          <div class="row">
            <div class="col-md-12 mt-3">
              <button class="btn btn-secondary btn-block" v-on:click="save()">
                <i class="fas fa-save"></i>
                Guardar
              </button>
            </div>
          </div>
          <!-- row -->
        </div>
        <div class="col-md-4 separated-column text-left" v-if="isAdmin">
          <!-- Columna 2 -->
          <h4 class="pt-2">Datos y estadísticas</h4>
          <div class="card mt-3">
            <div class="card-header">
              <h5 class="pt-2">Evolución de ingresos</h5>
            </div>
            <div class="card-body">
              <canvas ref="incomeEvolution" height="250"></canvas>
            </div>
            <!-- card-body -->
          </div>
          <!-- card  -->
          <div class="card mt-3">
            <div class="card-header">
              <h5 class="pt-2">Desglose de ingresos por tipo de trabajo</h5>
            </div>
            <div class="card-body">
              <canvas ref="incomeEvolutionPerType" height="250"></canvas>
            </div>
            <!-- card-body -->
          </div>
          <!-- card  -->
        </div>
        <!-- col-md-4 -->
      </div>
      <!-- row -->
    </div>
    <!-- container -->
  </div>
</template>

<script>
import { getDentist, updateDentist, getMonthTotalsPerDentist, getSumPerDentistPerWorkType } from '../../../main/dal.js'
import collapsibleLinkButton from '../PageElements/CollapsibleButtons/collapsibleLinkButton'
import { configGet } from '../../../main/store.js'
import { required, email, numeric, minLength, maxLength } from 'vuelidate/lib/validators'
import * as log from 'loglevel'

/* eslint no-undef: "off" */

export default {
	name: 'dentistDetail',
	components: {
		collapsibleLinkButton
	},
	data() {
		return {
			dentistId: 0,
			requiresValidation: false,
			data: {
				IdDentista: '',
				NombreDentista: '',
				NombreClinica: '',
				DatosFiscales: '',
				Direccion: '',
				DatosBancarios: '',
				DatosInteres: '',
				CorreoElectronico: '',
				CP: '',
				Poblacion: '',
				Telefono: '',
				Telefono2: ''
			},
			isAdmin: false,
			moneyFormatter: new Intl.NumberFormat('es-ES', {
				style: 'currency',
				currency: 'EUR'
			})
		}
	},
	validations: {
		data: {
			IdDentista: {},
			NombreDentista: { required },
			NombreClinica: {},
			DatosFiscales: {},
			Direccion: {},
			DatosBancarios: {},
			DatosInteres: {},
			CorreoElectronico: { email },
			CP: { numeric, minLength: minLength(5), maxLength: maxLength(5) },
			Poblacion: {},
			Telefono: {},
			Telefono2: {}
		}
	},
	methods: {
		getWorkListUrl: function() {
			return `/works/list/dentist/${this.dentistId}?title=Lista de Trabajos de ${this.data.NombreDentista}`
		},
		getInvoiceListUrl: function() {
			return `/finances?dentistName=${encodeURIComponent(this.data.NombreDentista)}`
		},
		save: function(url) {
			log.info('save')
			this.$v.data.$touch()
			if (this.$v.data.$anyError) {
				if (this.$v.data.CorreoElectronico.$anyError) {
					document.getElementById('correoElectronico').focus()
				}
				if (this.$v.data.CP.$anyError) {
					document.getElementById('codigoPostal').focus()
				}
				if (this.$v.data.NombreDentista.$anyError) {
					document.getElementById('dentista').focus()
				}
				return false
			}
			updateDentist(this.data)
			this.$v.$reset()
			if (url === undefined || url === '') {
				log.info(`>> navigate: go(-1)`)
				this.$router.go(-1)
			} else {
				log.info(`>> navigate: ${url}`)
				this.$router.push({
					path: url
				})
			}
		},
		loadGraph: async function() {
			var dataMonths = await getMonthTotalsPerDentist(this.dentistId)
			var dataWorkTypes = await getSumPerDentistPerWorkType(this.dentistId)

			this.yearsExpenseEvolutionChart = [new Date().getFullYear(), new Date().getFullYear() - 1]

			var barChartData = {
				labels: [
					'Enero',
					'Febrero',
					'Marzo',
					'Abril',
					'Mayo',
					'Junio',
					'Julio',
					'Agosto',
					'Septiembre',
					'Octobre',
					'Noviembre',
					'Diciembre'
				],
				datasets: [
					{
						label: this.yearsExpenseEvolutionChart[1],
						backgroundColor: 'rgba(93, 169, 233, .8)',
						borderColor: 'rgba(93, 169, 233, 1)',
						borderWidth: 1,
						data: dataMonths.lastYear
					},
					{
						label: this.yearsExpenseEvolutionChart[0],
						backgroundColor: 'rgba(247, 146, 86, .8)',
						borderColor: 'rgba(247, 146, 86, 1)',
						borderWidth: 1,
						data: dataMonths.thisYear
					}
				]
			}

			var ctxIncomeEvolution = this.$refs.incomeEvolution.getContext('2d')
			this.expenseEvolutionChart = new Chart(ctxIncomeEvolution, {
				type: 'bar',
				data: barChartData,
				options: {
					responsive: true,
					legend: {
						position: 'bottom'
					},
					title: {
						display: false
					},
					tooltips: {
						callbacks: {
							label: this.setExpenseEvolutionTooltip
						}
					}
				}
			})

			// -----------------

			var barGroupedChartData = {
				labels: dataWorkTypes.labels,
				datasets: [
					{
						backgroundColor: [
							'rgb(255, 186, 73)',
							'rgb(227, 74, 111)',
							'rgb(248, 178, 189)',
							'rgb(178, 161, 152)',
							'rgb(96, 165, 97)'
						],
						borderWidth: 1,
						data: dataWorkTypes.data
					}
				]
			}

			var ctxIncomeEvolutionPerWorkType = this.$refs.incomeEvolutionPerType.getContext('2d')
			this.expenseEvolutionChart = new Chart(ctxIncomeEvolutionPerWorkType, {
				type: 'pie',
				data: barGroupedChartData,
				options: {
					responsive: true,
					legend: {
						position: 'bottom'
					},
					title: {
						display: false
					}
				}
			})
		},
		setExpenseEvolutionTooltip(tooltipItem) {
			return `${tooltipItem.xLabel} ${
				this.yearsExpenseEvolutionChart[tooltipItem.datasetIndex]
			}: ${this.moneyFormatter.format(tooltipItem.yLabel)}`
		},
		setWorkTypeTooltip(tooltipItem) {
			return `${tooltipItem.xLabel} ${
				this.yearsExpenseEvolutionChart[tooltipItem.datasetIndex]
			}: ${this.moneyFormatter.format(tooltipItem.yLabel)}`
		},
		getConfig: async function() {
			this.isAdmin = configGet('isAdmin')
		},
		getData: async function() {
			this.dentistId = this.$route.params.id
			this.data = await getDentist(this.dentistId)
			document.getElementById('dentista').focus()
			if (this.$route.query.name !== undefined) {
				this.data.NombreDentista = this.$route.query.name
			}
		}
	},
	created() {
		this.getConfig()
	},
	mounted() {
		this.getData()
		this.loadGraph()
		this.$root.$on('topbar:save', this.save)
	},
	computed: {
		isDirty() {
			return this.$v.$anyDirty
		},
		isError() {
			return this.$v.$anyError
		}
	}
}
</script>
