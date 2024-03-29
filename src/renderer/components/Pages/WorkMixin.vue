<script>
'use strict'

import Vue from 'Vue'
import workIndicationsTable from '../PageElements/tables/workIndicationsTable'
import workTestsTable from '../PageElements/tables/workTestsTable'
import postSalesTable from '../PageElements/tables/postSalesTable'
import collapsibleActionButton from '../PageElements/CollapsibleButtons/collapsibleActionButton'
import dentistSearch from '../PageElements/typeAheads/DentistSearch'
import workAdjuncts from '../PageElements/WorkAdjuncts'
import labelEsqueleticos from '../Labels/LabelEsqueleticos'
import labelCompostura from '../Labels/labelCompostura'
import labelResina from '../Labels/LabelResina'
import labelAditamentos from '../Labels/labelAditamentos'
import labelComposite from '../Labels/labelComposite'
import labelGarantia from '../Labels/LabelGarantia'
import { validId } from '../Validators/validId.js'
import { decimal } from 'vuelidate/lib/validators'
import WorkService from '../../../services/WorkService'
// eslint-disable-next-line
import bModal from 'bootstrap-vue'
import log from 'loglevel'

export default {
	components: {
		workIndicationsTable,
		workTestsTable,
		postSalesTable,
		collapsibleActionButton,
		workAdjuncts,
		dentistSearch
	},
	data() {
		return {
			// It's necessary to use a boolean var instead of the isDirty bacause the form has a field with the focus that automatically touches the validator.
			saveButtonPressed: false,

			work: {
				IdTrabajo: 0,
				IdDentista: 0,
				NombreDentista: '',
				IdTipoTrabajo: 0,
				Paciente: '',
				Color: '',
				PrecioMetal: 0,
				PrecioConDescuento: 0,
				FechaEntrada: '',
				FechaPrevista: '',
				FechaPrevistaPrueba: '',
				FechaTerminacion: '',
				PorcentajeDescuento: 0,
				TotalDescuento: 0
			},
			workTypes: {},
			workIndications: [],
			workIndicationsText: '',
			workAdjuncts: {
				IdTrabajo: 0,
				Caja: '',
				Cubeta: '',
				Articulador: '',
				Pletinas: '',
				Tornillos: '',
				Analogos: '',
				PosteImpresion: '',
				Interface: '',
				Otros: ''
			},
			adjunctsVisible: false,
			workAdjunctsJustAdded: false,
			url: ''
		}
	},
	validations: {
		work: {
			IdTrabajo: {},
			IdDentista: { validId },
			NombreDentista: {},
			IdTipoTrabajo: { validId },
			Paciente: {},
			Color: {},
			PrecioMetal: { decimal },
			PrecioConDescuento: { decimal },
			FechaEntrada: {},
			FechaPrevista: {},
			FechaPrevistaPrueba: {},
			FechaTerminacion: {},
			PorcentajeDescuento: { decimal },
			TotalDescuento: { decimal }
		},
		workAdjuncts: {
			IdTrabajo: {},
			Caja: {},
			Cubeta: {},
			Articulador: {},
			Pletinas: {},
			Tornillos: {},
			Analogos: {},
			PosteImpresion: {},
			Interface: {},
			Otros: {}
		}
	},
	methods: {
		hideModal() {
			this.$refs.printLabelModal.hide()
			this.$v.$reset()
		},
		printLabel: function(label) {
			var currentLabel = this.printedLabel
			if (label) {
				currentLabel = label
			}
			var ComponentClass = this.mapType(currentLabel)
			var instance = new ComponentClass({
				propsData: {
					workData: this.work,
					workIndicationsText: this.workIndicationsText,
					workAdjuncts: this.workAdjuncts,
					name: currentLabel
				}
			})
			instance.$mount()
			this.$refs.labelContainer.appendChild(instance.$el)
			instance.print()
			this.$refs.labelContainer.removeChild(instance.$el)
		},
		mapType(type) {
			switch (type) {
				case 'Aditamentos':
					return Vue.extend(labelAditamentos)
				case 'Composite':
				case 'E-Max':
				case 'Implantes':
				case 'Metal-Cerámica':
				case 'Zirconio':
					return Vue.extend(labelComposite)
				case 'Esqueléticos':
					return Vue.extend(labelEsqueleticos)
				case 'Compostura':
				case 'Ortodoncia':
					return Vue.extend(labelCompostura)
				case 'Resina':
					return Vue.extend(labelResina)
				case 'Garantia':
					return Vue.extend(labelGarantia)
				default:
					log.error(`Unexpected label type in WorkDetail.printLabel(): ${type}`)
					throw new Error(`Unexpected label type in WorkDetail.printLabel(): ${type}`)
			}
		},
		getToday: function() {
			var today = new Date()
			var dd = today.getDate()

			var mm = today.getMonth() + 1
			var yyyy = today.getFullYear()
			if (dd < 10) {
				dd = '0' + dd
			}

			if (mm < 10) {
				mm = '0' + mm
			}
			return `${yyyy}-${mm}-${dd}`
		},
		showAdjunts: function(justAdded) {
			log.info('ShowAdjunts button clicked')
			if (justAdded === undefined || justAdded.type === 'click') {
				this.workAdjunctsJustAdded = true
				this.workAdjuncts = {
					Caja: '',
					Cubeta: '',
					Articulador: '',
					Pletinas: '',
					Tornillos: '',
					Analogos: '',
					PosteImpresion: '',
					Interface: '',
					Otros: ''
				}
			} else {
				this.workAdjunctsJustAdded = justAdded
			}
			this.adjunctsVisible = true
		}
	},
	created() {
		this.workService = new WorkService()
	},
	mounted() {
		this.workService.getWorkTypes().then(types => {
			this.workTypes = types
		})
	}
}
</script>
