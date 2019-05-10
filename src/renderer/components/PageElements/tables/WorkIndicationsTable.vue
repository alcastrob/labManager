<template>
  <div id="workIndicationsTable" class="table-editable">
    <div>
      <table class="table table-bordered table-responsive-xs table-striped">
        <tr>
          <th style="width: 4%;"></th>
          <th class="text-left" style>Cantidad</th>
          <th class="text-left" style="width: 50%;">Descripción</th>
          <th class="text-left" style>Notas</th>
          <th class="text-left" style>Descuento</th>
          <th style="width: 16%;" class="text-right">Precio individual</th>
          <th style="width: 16%;" class="text-right">Subtotal</th>
        </tr>
        <tr v-for="indication in data" v-bind:key="indication.IdTrabajoDetalle">
          <td class="pt-3-half">
            <i
              v-if="$attrs.disabled !== true"
              class="fa fa-times-circle"
              :click="deleteRow(indication.IdTrabajoDetalle)"
            ></i>
          </td>
          <td class="noMargins">
            <input
              type="text"
              v-model="indication.Cantidad"
              class="inputInTd text-right"
              :class="{'bg-danger text-white animated flash': isNotANumber(indication.Cantidad)}"
            >
          </td>
          <td class="noMargins">
            <input
              type="text"
              v-model="indication.Descripcion"
              class="inputInTd"
              @change="trackChanges($event, indication.IdTrabajoDetalle, 'Descripcion')"
              :class="{'bg-danger text-white animated flash': indication.Descripcion.length === 0}"
              :disabled="$attrs.disabled === true"
            >
          </td>
          <td class="noMargins">
            <input type="text" class="inputInTd" v-model="indication.Notas">
          </td>
          <td class="noMargins">
            <input type="text" class="inputInTd text-right" v-model="indication.Descuento">
          </td>
          <td class="noMargins">
            <input type="text" class="inputInTd text-right" v-model="indication.PrecioIndividual">
          </td>
          <td class="noMargins">
            <input
              type="text"
              class="inputInTd text-right"
              @blur="updatePrice($event, indication.IdTrabajoDetalle)"
              v-model="indication.Precio"
              :class="{'bg-danger text-white animated flash': isNotANumber(indication.Precio)}"
              v-on:keydown="filterJustNumberKeystrokes"
              @change="trackChanges($event, indication.IdTrabajoDetalle, 'Precio')"
              :disabled="$attrs.disabled === true"
            >
          </td>
        </tr>
        <!-- The empty row for new values -->
        <tr v-if="$attrs.disabled !== true">
          <td class="pt-3-half"></td>
          <td class="noMargins">
            <input type="text" class="inputInTd text-right" v-model="$v.newRow.cantidad.$model">
          </td>
          <td class="noMargins">
            <catalog-search
              ref="catalog"
              v-model="$v.newRow.descripcion.$model"
              @change="track($event)"
            ></catalog-search>
          </td>
          <td class="noMargins">
            <input type="text" class="inputInTd" v-model="$v.newRow.notas.$model">
          </td>
          <td class="noMargins">
            <input type="text" class="inputInTd text-right" v-model="$v.newRow.descuento.$model">
          </td>
          <td class="noMargins">
            <input
              type="text"
              class="inputInTd text-right"
              v-model="$v.newRow.precio.$model"
              :class="{'bg-danger text-white animated flash': $v.newRow.precio.$error && !allRowEmpty}"
              @blur="addLastRow()"
              v-on:keydown="filterJustNumberKeystrokes"
            >
          </td>
          <td class="noMargins">
            <input
              type="text"
              class="inputInTd text-right"
              v-model="$v.newRow.subtotal.$model"
              :class="{'bg-danger text-white animated flash': $v.newRow.precio.$error && !allRowEmpty}"
              @blur="addLastRow()"
              v-on:keydown="filterJustNumberKeystrokes"
            >
          </td>
        </tr>
      </table>
      <div>
        <p
          class="float-right text-right pr-1"
          :class="{'d-inline-block text-danger animated shake': sumError}"
        >{{getSum()}}</p>
      </div>
      <!-- <div>
        <h3>Inserted</h3>
        <ul v-for="inserted in insertedRows" :key="inserted.IdTrabajoDetalle">
          <li>{{inserted.IdTrabajoDetalle}}|{{inserted.Descripcion}}|{{inserted.Precio}}</li>
        </ul>
        <h3>Updated</h3>
        <ul v-for="updated in updatedRows" :key="updated.IdTrabajoDetalle">
          <li>{{updated.IdTrabajoDetalle}}|{{updated.Descripcion}}|{{updated.Precio}}</li>
        </ul>
        <h3>Deleted</h3>
        <ul v-for="deleted in deletedRows" :key="deleted.IdTrabajoDetalle">
          <li>{{deleted.IdTrabajoDetalle}}|{{deleted.Descripcion}}|{{deleted.Precio}}</li>
        </ul>
      </div>-->
    </div>
  </div>
</template>

<script>
import tablesWithEmptyRowMixin from './tablesWithEmptyRowsMixin'
import WorkIndicationService from '../../../../services/WorkIndicationService.js'
import _ from 'lodash'
import { decimal, minLength, required } from 'vuelidate/lib/validators'
import log from 'loglevel'
import catalogSearch from '../typeAheads/CatalogSearch'

export default {
	name: 'workIndicationsTable',
	mixins: [tablesWithEmptyRowMixin],
	components: {
		catalogSearch
	},
	data() {
		return {
			sumError: false,
			newRow: {
				cantidad: '',
				descripcion: '',
				notas: '',
				descuento: '',
				precio: '',
				subtotal: ''
			}
		}
	},
	validations: {
		newRow: {
			cantidad: {
				required,
				minLength: minLength(1)
			},
			descripcion: {
				required,
				minLength: minLength(1)
			},
			notas: {
				minLength: minLength(0)
			},
			descuento: {
				decimal
			},
			precio: {
				required,
				decimal,
				minLength: minLength(1)
			},
			subtotal: {
				required,
				decimal,
				minLength: minLength(1)
			}
		}
	},
	methods: {
		// Related with the state and persistence----------------------------------
		addLastRow() {
			if (this.$v.newRow.$anyDirty) {
				this.$v.newRow.$touch()
				if (!this.$v.newRow.$anyError) {
					var newRow = {
						Descripcion: this.newRow.descripcion,
						IdTrabajoDetalle: this.newIds++,
						Precio: this.newRow.precio
					}
					this.data.push(newRow)
					this.insertedRows.push(newRow)
					this.newRow.descripcion = ''
					this.newRow.precio = ''
					this.$v.newRow.$reset()
					this.$emit('input', this.data)
					this.$refs.newDescripcion.focus()
				}
			}
		},
		deleteRow: function(rowId) {
			this.data = _.remove(this.data, function(n) {
				return n.IdTrabajoDetalle !== rowId
			})
			this.$emit('input', this.data)
			if (_.some(this.insertedRows, ['IdTrabajoDetalle', rowId])) {
				_.remove(this.insertedRows, ['IdTrabajoDetalle', rowId])
			} else if (_.some(this.updatedRows, ['IdTrabajoDetalle', rowId])) {
				_.remove(this.updatedRows, ['IdTrabajoDetalle', rowId])
				this.deletedRows.push({ IdTrabajoDetalle: rowId })
			} else {
				this.deletedRows.push({ IdTrabajoDetalle: rowId })
			}
		},
		trackChanges(event, rowId, field) {
			// Let's start looking if the changed row is already on the inserted list
			var temp = _.find(this.insertedRows, ['IdTrabajoDetalle', rowId])
			if (temp) {
				// Just update the insert with the new value. No more action required.
				temp[field] = event.currentTarget.value
			} else {
				// OK, so we have to update. But maybe this field was already updated. Let's check.
				temp = _.find(this.updatedRows, ['IdTrabajoDetalle', rowId])
				if (temp) {
					// The row was already updated. Make a cumulative update
					var original = _.find(this.data, ['IdTrabajoDetalle', rowId])
					temp.Precio = original.Precio
					temp.Descripcion = original.Descripcion
				} else {
					// First time updated. So jot it down.
					var original = _.find(this.data, ['IdTrabajoDetalle', rowId])
					this.updatedRows.push(original)
				}
			}
			this.$emit('input', this.data)
		},
		async save(masterId) {
			if (masterId !== 0) {
				_.forEach(this.insertedRows, async row => {
					row.IdTrabajo = masterId
					await this.workIndicationService.insertWorkIndications(row)
				})
				_.forEach(this.deletedRows, async row => this.workIndicationService.deleteWorkIndications(row))
				_.forEach(this.updatedRows, async row => this.workIndicationService.updateWorkIndications(row))
				await this.workIndicationService.updatePriceSum(masterId)
				this.insertedRows = []
				this.deletedRows = []
				this.updatedRows = []
			}
		},
		track: function(e) {
			this.newRow.precio = e.Precio
			if (!this.newRow.cantidad) {
				this.newRow.cantidad = 1
			}
			this.newRow.subtotal = this.newRow.precio * this.newRow.cantidad
		},
		// Other methods (specific)------------------------------------------------
		getSum: function() {
			try {
				var sum = _.sumBy(this.data, function(n) {
					var temp = parseFloat(n.Precio)
					if (isNaN(temp)) {
						throw 'NaN'
					} else {
						return temp
					}
				})
				this.sumError = false
				this.$emit('change', sum)
				return 'Total: ' + this.moneyFormatter.format(sum)
			} catch (err) {
				log.info('Datos incorrectos a sumar en la tabla de indicaciones')
				this.sumError = true
				return 'Datos incorrectos a sumar en la tabla de indicaciones'
			}
		},
		updatePrice(event, id) {
			var elementInArray = _.find(this.data, ['IdTrabajoDetalle', id])
			if (event.srcElement.value) {
				elementInArray.Precio = 0
			} else {
				elementInArray.Precio = event.srcElement.value
			}
			this.$emit('input', this.data)
		},
		filterJustNumberKeystrokes(event) {
			if (
				!(
					event.key === '0' ||
					event.key === '1' ||
					event.key === '2' ||
					event.key === '3' ||
					event.key === '4' ||
					event.key === '5' ||
					event.key === '6' ||
					event.key === '7' ||
					event.key === '8' ||
					event.key === '9' ||
					event.key === '.' ||
					event.key === 'ArrowLeft' ||
					event.key === 'ArrowRight' ||
					event.key === 'Home' ||
					event.key === 'End' ||
					event.key === '-' ||
					(event.key === 'c' && event.ctrlKey === true) ||
					event.key === 'Delete' ||
					(event.key === 'v' && event.ctrlKey === true) ||
					event.key === 'Backspace' ||
					event.key === 'Tab' ||
					event.key === 'Enter'
				)
			) {
				event.preventDefault()
			}
		},
		focus: function() {
			document.getElementById('workIndicationsTable').focus()
		},
		cleanComponent() {
			this.newIds = 10000000
			this.insertedRows = []
			this.deletedRows = []
			this.updatedRows = []
			this.sumError = false
			this.newRow.descripcion = ''
			this.newRow.precio = ''
			this.$v.newRow.$reset()
		},
		isError() {
			return document.getElementsByClassName('bg-danger').length > 0 || this.$v.newRow.$anyError
		}
	},
	computed: {
		allRowEmpty: function() {
			return this.$v.newRow.descripcion.$model.length === 0 && this.$v.newRow.precio.$model.length === 0
		}
	},
	created() {
		this.workIndicationService = new WorkIndicationService()
	}
}
</script>
