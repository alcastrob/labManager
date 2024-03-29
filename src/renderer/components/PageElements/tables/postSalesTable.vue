<template>
	<div id="postSalesTable" class="table-editable">
		<table class="table table-bordered table-responsive-xs table-striped" v-on-clickaway="hidePanel">
			<tr>
				<th style="width: 4%"></th>
				<th class="text-left" style="width: 18%">Fecha</th>
				<th class="text-left" style="width: 33%">Especialista</th>
				<th class="text-left" style="width: 45%">Actuación</th>
			</tr>
			<tr v-for="postSales in data" v-bind:key="postSales.IdPostVenta">
				<td class="pt-3-half" @focus="hidePanel">
					<i
						class="fa fa-times-circle"
						v-on:click="deleteRow(postSales.IdPostVenta)"
						v-if="$attrs.disabled !== true"
					></i>
				</td>
				<td class="noMargins">
					<input
						type="date"
						class="inputInTd"
						id="fSalida"
						v-model="postSales.Fecha"
						@blur="changedDate($event)"
						@change="trackChanges($event, postSales.IdPostVenta, 'Fecha')"
						@focus="hidePanel"
						:disabled="$attrs.disabled === true"
					/>
				</td>
				<td class="noMargins">
					<select
						class="inputInTd"
						v-model="postSales.IdTecnico"
						@change="trackChanges($event, postSales.IdPostVenta, 'IdTecnico')"
						@focus="hidePanel"
						@blur="changeSign($event)"
						:disabled="$attrs.disabled === true"
					>
						<option value></option>
						<option
							v-for="technician in technicians"
							v-bind:key="technician.IdTecnico"
							v-bind:value="technician.IdTecnico"
						>
							{{ technician.Nombre }}
						</option>
					</select>
				</td>
				<td class="noMargins">
					<input
						type="text"
						class="inputInTd"
						v-model="postSales.Actuacion"
						@blur="changeDescription($event)"
						@change="trackChanges($event, postSales.IdPostVenta, 'Nombre')"
						v-on:focus="showPanel($event)"
						:disabled="$attrs.disabled === true"
					/>
				</td>
			</tr>
			<!-- The empty row for new values -->
			<tr v-if="$attrs.disabled !== true">
				<td class="pt-3-half"></td>
				<td class="noMargins">
					<input
						type="date"
						v-model="$v.newRow.fecha.$model"
						class="inputInTd"
						ref="newFecha"
						id="newFecha"
						:class="{ 'bg-danger text-white animated flash': isInvalidNewDate }"
					/>
				</td>
				<td class="noMargins">
					<select class="inputInTd" ref="newEspecialista" v-model="$v.newRow.idTecnico.$model">
						<option selected="selected"></option>
						<option
							v-for="technician in technicians"
							v-bind:key="technician.IdTecnico"
							v-bind:value="technician.IdTecnico"
						>
							{{ technician.Nombre }}
						</option>
					</select>
				</td>
				<td class="noMargins">
					<input
						type="text"
						class="inputInTd"
						v-model="$v.newRow.actuacion.$model"
						:class="{'bg-danger text-white animated flash': $v.newRow.actuacion.$error && !allRowEmpty}"
            @blur="addLastRow()"
					/>
				</td>
			</tr>
		</table>
	</div>
</template>

<script>
import tablesWithEmptyRowMixin from './tablesWithEmptyRowsMixin'
import PostSalesService from '../../../../services/PostSalesService'
import TechnicianService from '../../../../services/TechnicianService'
import { mixin as clickaway } from 'vue-clickaway'
import { required } from 'vuelidate/lib/validators'
import _ from 'lodash'

export default {
	name: 'postSalesTable',
	mixins: [clickaway, tablesWithEmptyRowMixin],
	props: {
		workId: Number
	},
	data() {
		return {
			deliveryShifts: [],
			panels: {},
			technicians: [],
			newRow: {
				fecha: '',
				actuacion: '',
				idTecnico: ''
			},
			isInvalidNewDate: false
		}
	},
	validations: {
		newRow: {
			fecha: { required },
			actuacion: { required },
			idTecnico: {}
		}
	},
	methods: {
		// Related with the state and persistence----------------------------------
		addLastRow() {
			if (this.allRowEmpty) {
				this.$v.newRow.$reset()
			} else if (this.$v.newRow.$anyDirty) {
				this.$v.newRow.$touch()
				if (!this.$v.newRow.$anyError) {
					var newRow = {
						IdPostVenta: this.newIds++,
						IdTrabajo: this.workId,
						Fecha: this.$v.newRow.fecha.$model,
						Actuacion: this.$v.newRow.actuacion.$model,
						IdTecnico: this.$v.newRow.idTecnico.$model
					}
					this.data.push(newRow)
					this.insertedRows.push(newRow)
					this.$v.newRow.fecha.$model = ''
					this.$v.newRow.actuacion.$model = ''
					this.$v.newRow.idTecnico.$model = ''
					this.$v.newRow.$reset()
					this.$emit('input', this.tests)
					this.$refs.newFecha.focus()
				}
			}
		},
		deleteRow: function (rowId) {
			this.data = _.remove(this.data, function (n) {
				return n.IdPostVenta !== rowId
			})
			this.$emit('input', this.data)
			if (_.some(this.insertedRows, ['IdPostVenta', rowId])) {
				_.remove(this.insertedRows, ['IdPostVenta', rowId])
			} else if (_.some(this.updatedRows, ['IdPostVenta', rowId])) {
				_.remove(this.updatedRows, ['IdPostVenta', rowId])
				this.deletedRows.push({ IdPostVenta: rowId })
			} else {
				this.deletedRows.push({ IdPostVenta: rowId })
			}
		},
		trackChanges(event, rowId, field) {
			// Let's start looking if the changed row is already on the inserted list
			var temp = _.find(this.insertedRows, ['IdPostVenta', rowId])
			if (temp) {
				// Just update the insert with the new value. No more action required.
				temp[field] = event.currentTarget.value
			} else {
				// OK, so we have to update. But maybe this field was already updated. Let's check.
				temp = _.find(this.updatedRows, ['IdPostVenta', rowId])
				if (temp) {
					// The row was already updated. Make a cumulative update
					var original = _.find(this.data, ['IdPostVenta', rowId])
					temp.IdTrabajo = original.IdTrabajo
					temp.Descripcion = original.Descripcion
					temp.Fecha = original.Fecha
					temp.IdTurnoFecha = original.IdTurnoFecha
					temp.FechaEntrada = original.FechaEntrada
					temp.IdTurnoFechaEntrada = original.IdTurnoFechaEntrada
				} else {
					// First time updated. So jot it down.
					var original = _.find(this.data, ['IdPostVenta', rowId])
					this.updatedRows.push(original)
				}
			}

			// Last, but not least. If the change is made in the outbound date, the work 'Test Expected Date' must be reset.
			if (
				event.currentTarget.id === 'fSalida' &&
				event.currentTarget.value !== '' &&
				event.currentTarget.validity.valid
			) {
				this.$parent._data.work.FechaPrevistaPrueba = ''
			}
			this.$emit('input', this.data)
		},
		save: async function (masterId) {
			_.forEach(this.insertedRows, async (row) => {
				row.IdTrabajo = masterId
				await this.postSalesService.insertPostSale(row)
			})
			_.forEach(this.deletedRows, async (row) => this.postSalesService.deletePostSale(row))
			_.forEach(this.updatedRows, async (row) => this.postSalesService.updatePostSale(row))
			this.insertedRows = []
			this.deletedRows = []
			this.updatedRows = []
		},
		showPanel: async function (event) {
			_.forEach(Object.keys(this.panels), (panelId) => {
				this.panels[panelId] = false
			})
			this.panels[event.currentTarget.id] = true
			this.$forceUpdate()
		},
		hidePanel: function (id) {
			if (id.type === undefined) {
				this.panels[id] = false
			} else {
				_.forEach(Object.keys(this.panels), (panelId) => {
					this.panels[panelId] = false
				})
			}
			this.$forceUpdate()
		},
		canShow: function (id) {
			return this.panels[id]
		},
		changeDescription: function (event) {
			var element = event.currentTarget
			this.toggleValidation(element, element.value.length > 0)
		},
		changedDate: function (event) {
			var element = event.currentTarget
			this.toggleValidation(element, element.validity.valid)
		},
		changeSign: function (event) {
			var element = event.currentTarget
			this.toggleValidation(element, element.value.length > 0)
		},
		updateIfDateIsValid(event) {
			// Unfortunatelly, this check cannot be done on the :class of the input element, because the state must be updated on the @blur and the @input events. That's the reason to put appart the "invalid" state into a var.

			if (event.currentTarget.id === 'newFecha') {
				this.isInvalidNewDate = !event.currentTarget.validity.valid
			} else {
				this.isInvalidNewDate = !event.currentTarget.validity.valid
			}
		},
		toggleValidation(element, isValid) {
			if (!isValid) {
				element.classList.add('bg-danger')
				element.classList.add('text-white')
				element.classList.add('animated')
				element.classList.add('flash')
			} else {
				element.classList.remove('bg-danger')
				element.classList.remove('text-white')
				element.classList.remove('animated')
				element.classList.remove('flash')
			}
		},
		focus: function () {
			document.getElementById('workTestTable').focus()
		},
		cleanComponent() {
			this.newIds = 10000000
			this.insertedRows = []
			this.deletedRows = []
			this.updatedRows = []
			this.newRow.actuacion = ''
			this.newRow.fecha = ''
			this.newRow.idTecnico = ''
			this.isInvalidNewDate = false
			this.$v.newRow.$reset()
		},
		isError() {
			return document.getElementsByClassName('bg-danger').length > 0 || this.$v.newRow.$anyError
		}
	},
	computed: {
		allRowEmpty: function () {
			return (
				this.$v.newRow.fecha.$model.length === 0 &&
				this.$v.newRow.actuacion.$model.length === 0 &&
				this.$v.newRow.idTecnico.$model === null
			)
		}
	},
	async created() {
		this.postSalesService = new PostSalesService()
		this.technicians = await new TechnicianService().getTechniciansList()
	}
}
</script>

<style>
.pt-3-half {
	padding-top: 1.4rem;
}
input[type='date']::-webkit-inner-spin-button {
	display: none;
}
</style>
