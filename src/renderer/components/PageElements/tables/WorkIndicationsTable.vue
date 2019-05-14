<template>
  <div class="table-editable">
    <div>
      <table
        class="table table-bordered table-responsive-xs table-striped"
        ref="workIndicationsTable"
      >
        <tr>
          <th style="width: 4%;"></th>
          <th class="text-left" style="width: 45%;">Descripción</th>
          <th class="text-left" style="width: 3%;">Cantidad</th>
          <th class="text-left" style="width: 15%;">Notas</th>
          <th class="text-right" style="width: 11%;">P. individual</th>
          <th class="text-right" style="width: 11%;">Subtotal</th>
        </tr>
        <tr v-for="indication in data" v-bind:key="indication.IdTrabajoDetalle">
          <td class="pt-3-half">
            <i
              v-if="$attrs.disabled !== true"
              class="fa fa-times-circle"
              @click="deleteRow(indication.IdTrabajoDetalle)"
            ></i>
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
            <input
              type="text"
              v-model="indication.Cantidad"
              class="inputInTd text-right"
              @change="updatePrice(indication.Cantidad, indication.Precio, indication.IdTrabajoDetalle)"
              :class="{'bg-danger text-white animated flash': isNotANumber(indication.Cantidad)}"
            >
          </td>
          <td class="noMargins">
            <input
              type="text"
              class="inputInTd"
              @change="trackChanges($event, indication.IdTrabajoDetalle, 'Notas')"
              v-model="indication.Notas"
            >
          </td>
          <td class="noMargins">
            <input
              type="text"
              class="inputInTd text-right"
              @blur="updatePrice(indication.Cantidad, indication.Precio, indication.IdTrabajoDetalle)"
              v-model="indication.Precio"
            >
          </td>
          <td class="noMargins">
            <input type="text" class="inputInTd text-right" v-model="indication.Subtotal" disabled>
          </td>
        </tr>
        <!-- The empty row for new values -->
        <tr v-if="$attrs.disabled !== true">
          <td class="pt-3-half"></td>
          <td class="noMargins">
            <catalog-search
              ref="catalog"
              v-model="$v.newRow.Descripcion.$model"
              @change="selectFromCatalog($event)"
            ></catalog-search>
          </td>
          <td class="noMargins">
            <input
              type="text"
              class="inputInTd text-right"
              ref="ammountAfterCatalog"
              v-model="$v.newRow.Cantidad.$model"
              :class="{'bg-danger text-white animated flash': $v.newRow.Cantidad.$error && !allRowEmpty}"
              @change="updatePrice()"
              v-on:keydown="filterJustNumberKeystrokes"
            >
          </td>
          <td class="noMargins">
            <input
              type="text"
              class="inputInTd"
              v-model="$v.newRow.Notas.$model"
              @blur="onDescriptionBlur()"
            >
          </td>
          <td class="noMargins">
            <input
              type="text"
              class="inputInTd text-right"
              v-model="$v.newRow.Precio.$model"
              :class="{'bg-danger text-white animated flash': $v.newRow.Precio.$error && !allRowEmpty}"
              @blur="addLastRow()"
              v-on:keydown="filterJustNumberKeystrokes"
              :disabled="$v.newRow.Descripcion.$model !== -1"
            >
          </td>
          <td class="noMargins">
            <input
              type="text"
              class="inputInTd text-right"
              v-model="$v.newRow.Subtotal.$model"
              disabled
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
      <div>
        <h3>Inserted</h3>
        <ul v-for="inserted in insertedRows" :key="inserted.IdTrabajoDetalle">
          <li>{{inserted.IdTrabajoDetalle}}|{{inserted.Descripcion}}|{{inserted.Subtotal}}</li>
        </ul>
        <h3>Updated</h3>
        <ul v-for="updated in updatedRows" :key="updated.IdTrabajoDetalle">
          <li>{{updated.IdTrabajoDetalle}}|{{updated.Descripcion}}|{{updated.Subtotal}}</li>
        </ul>
        <h3>Deleted</h3>
        <ul v-for="deleted in deletedRows" :key="deleted.IdTrabajoDetalle">
          <li>{{deleted.IdTrabajoDetalle}}|{{deleted.Descripcion}}|{{deleted.Subtotal}}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import tablesWithEmptyRowMixin from './tablesWithEmptyRowsMixin'
import WorkIndicationService from '../../../../services/WorkIndicationService.js'
import _ from 'lodash'
import { decimal, minLength, minValue, required } from 'vuelidate/lib/validators'
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
				Cantidad: '',
				Descripcion: '',
				Notas: '',
				Precio: '',
				Subtotal: ''
			}
		}
	},
	validations: {
		newRow: {
			Cantidad: {
				required,
				minValue: minValue(1)
			},
			Descripcion: {
				required,
				minLength: minLength(1)
			},
			Notas: {
				minLength: minLength(0)
			},
			Precio: {
				required,
				decimal,
				minValue: minValue(0)
			},
			Subtotal: {
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
					var newRow = { ...this.newRow }
					newRow.IdTrabajoDetalle = this.newIds++
					newRow.IdElementoCatalogo = this.newRow.Descripcion.IdElementoCatalogo
					newRow.Descripcion = this.newRow.Descripcion.Descripcion
					this.data.push(newRow)
					this.insertedRows.push(newRow)
					this.newRow.Cantidad = ''
					this.newRow.Descripcion = ''
					this.newRow.Notas = ''
					this.newRow.Precio = ''
					this.newRow.Subtotal = ''
					this.$v.newRow.$reset()
					this.$emit('input', this.data)
					this.$refs.catalog.focus()
					this.$refs.catalog.clear()
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
				return
			}
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

			this.$emit('input', this.data)
		},
		async save(masterId) {
			debugger
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
		selectFromCatalog: function(e) {
			this.newRow.Precio = e.Precio
			// if (!this.newRow.Cantidad) {
			// 	this.newRow.Cantidad = 1
			// }
			this.updatePrice()
			this.$refs.ammountAfterCatalog.focus()
		},
		// Other methods (specific)------------------------------------------------
		getSum: function() {
			try {
				var sum = _.sumBy(this.data, function(n) {
					var temp = parseFloat(n.Subtotal)
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
		updatePrice(ammount, price, id) {
			if (id) {
				var elementInArray = _.find(this.data, ['IdTrabajoDetalle', id])
				if (ammount && price) {
					elementInArray.Subtotal = ammount * price
				}
				this.$emit('input', this.data)
				this.trackChanges({ currentTarget: { value: elementInArray.Subtotal } }, id, 'Subtotal')
			} else {
				// It's the new row who needs an update
				this.newRow.Subtotal = this.newRow.Cantidad * this.newRow.Precio
			}
		},
		onDescriptionBlur: function() {
			if (this.$v.newRow.Descripcion.$model !== -1) {
				this.addLastRow()
			}
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
			// Used by external container to set the focus in the component
			this.$refs.workIndicationsTable.focus()
		},
		cleanComponent() {
			this.newIds = 10000000
			this.insertedRows = []
			this.deletedRows = []
			this.updatedRows = []
			this.sumError = false
			this.newRow.Descripcion = ''
			this.newRow.Precio = ''
			this.$v.newRow.$reset()
		},
		isError() {
			return document.getElementsByClassName('bg-danger').length > 0 || (!this.allRowEmpty && this.$v.newRow.$anyError)
		}
	},
	computed: {
		allRowEmpty: function() {
			return (
				this.$v.newRow.Cantidad.$model.length === 0 &&
				this.$v.newRow.Descripcion.$model === -1 &&
				this.$v.newRow.Notas.$model.length === 0 &&
				this.$v.newRow.Precio.$model.length === 0 &&
				this.$v.newRow.Subtotal.$model.length === 0
			)
		}
	},
	created() {
		this.workIndicationService = new WorkIndicationService()
	}
}
</script>
