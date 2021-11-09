<template>
	<div id="table" class="table-editable">
		<div>
			<filterBar ref="filterBar"></filterBar>
			<table class="table table-bordered table-responsive-xs table-striped">
				<thead>
					<tr>
						<th style="width: 4%"></th>
						<th class="text-left" style="width: 50%">Nombre</th>
						<th class="text-right" style>Nº Colegiado</th>
					</tr>
				</thead>
				<tbody>
					<tr v-for="indication in getPaginatedData()" :key="indication.IdTecnico">
						<td class="pt-3-half">
							<i class="fa fa-times-circle" v-on:click="deleteRow(indication.IdTecnico)"></i>
						</td>
						<td class="noMargins">
							<input
								type="text"
								v-model="indication.Nombre"
								class="inputInTd"
								@change="trackChanges($event, indication.IdTecnico, 'Nombre')"
								@keyup.enter="trackChanges($event, indication.IdTecnico, 'Nombre')"
							/>
						</td>
						<td class="noMargins">
							<input
								class="inputInTd text-right"
								v-model="indication.NumColegiado"
								@change="trackChanges($event, indication.IdTecnico, 'NumColegiado')"
								@keyup.enter="trackChanges($event, indication.IdTecnico, 'NumColegiado')"
							/>
						</td>
					</tr>
					<!-- the blank line -->
					<tr v-if="$attrs.disabled !== true">
						<td class="pt-3-half"></td>
						<td class="noMargins">
							<input type="text" class="inputInTd" ref="newNombre" />
						</td>
						<td class="noMargins">
							<input
								type="text"
								class="inputInTd text-right"
								ref="newNumColegiado"
								@blur="addLastRow()"
								@keyup.enter="addLastRow()"
								v-on:keydown="filterJustNumberKeystrokes"
							/>
						</td>
					</tr>
				</tbody>
			</table>
			<pagination></pagination>
			<!-- <div>
      <h3>Inserted</h3>
      <ul v-for="inserted in insertedRows" :key="inserted.IdTecnico">
        <li>{{inserted.IdTecnico}}|{{inserted.Descripcion}}|{{inserted.Precio}}</li>
      </ul>
      <h3>Updated</h3>
      <ul v-for="updated in updatedRows" :key="updated.IdTecnico">
        <li>{{updated.IdTecnico}}|{{updated.Descripcion}}|{{updated.Precio}}</li>
      </ul>
      <h3>Deleted</h3>
      <ul v-for="deleted in deletedRows" :key="deleted.IdTecnico">
        <li>{{deleted.IdTecnico}}|{{deleted.Descripcion}}|{{deleted.Precio}}</li>
      </ul>
      </div>-->
		</div>
	</div>
</template>

<script>
import tablesWithEmptyRowMixin from './tablesWithEmptyRowsMixin'
import TechnicianService from '../../../../services/TechnicianService'
import euroInput from '../tables/euroInput'
import filterBar from '../tables/filterBar'
import pagination from '../tables/pagination'
import _ from 'lodash'
import moment from 'moment'

const PAGESIZE = 10

export default {
	name: 'catalogTable',
	mixins: [tablesWithEmptyRowMixin],
	components: {
		euroInput,
		pagination,
		filterBar
	},
	data() {
		return {
			rawDataset: [],
			filteredDataset: [],
			pageSize: PAGESIZE,
			currentPage: 1
		}
	},
	methods: {
		// Related with the state and persistence----------------------------------
		addLastRow() {
			if (this.$refs.newNombre.value || this.$refs.newNumColegiado.value) {
				var newRow = {
					IdTecnico: this.newIds++,
					Nombre: this.$refs.newNombre.value,
					NumColegiado: this.$refs.newNumColegiado.value
				}
				this.data.push(newRow)
				this.insertedRows.push(newRow)
				this.$refs.newNombre.value = ''
				this.$refs.newNumColegiado.value = ''
				this.save()
				this.$emit('input', this.data)
				this.$refs.newNombre.focus()
			}
		},
		deleteRow: function (rowId) {
			this.data = _.remove(this.data, function (n) {
				return n.IdTecnico !== rowId
			})
			if (_.some(this.insertedRows, ['IdTecnico', rowId])) {
				_.remove(this.insertedRows, ['IdTecnico', rowId])
			} else if (_.some(this.updatedRows, ['IdTecnico', rowId])) {
				_.remove(this.updatedRows, ['IdTecnico', rowId])
				this.deletedRows.push({ IdTecnico: rowId })
			} else {
				this.deletedRows.push({ IdTecnico: rowId })
			}
			this.save()
			this.$emit('input', this.rawDataset)
		},
		trackChanges(event, rowId, field) {
			// Let's start looking if the changed row is already on the inserted list
			var temp = _.find(this.insertedRows, ['IdTecnico', rowId])
			if (temp) {
				// Just update the insert with the new value. No more action required.
				temp[field] = event.currentTarget.value
			} else {
				// OK, so we have to update. But maybe this field was already updated. Let's check.
				temp = _.find(this.updatedRows, ['IdTecnico', rowId])
				if (temp) {
					// The row was already updated. Make a cumulative update
					var original = _.find(this.rawDataset, ['IdTecnico', rowId])
					temp.Nombre = original.Nombre
					temp.NumColegiado = original.NumColegiado
					temp.FechaInicio = original.FechaInicio
					temp[field] = event.currentTarget.value
				} else {
					// First time updated. So jot it down.
					var original = _.find(this.rawDataset, ['IdTecnico', rowId])
					if (original !== undefined) {
						// The catalog element is not expired yet, so we can update its values
						original[field] = event.currentTarget.value
						this.updatedRows.push(original)
					}
				}
			}
			this.save()
			this.$emit('input', this.rawDataset)
		},
		save() {
			_.forEach(this.insertedRows, async (row) => this.TechnicianService.insertTechnicianEntry(row))
			_.forEach(this.deletedRows, async (row) => this.TechnicianService.deleteTechnicianEntry(row))
			_.forEach(this.updatedRows, async (row) => this.TechnicianService.updateTechnicianEntry(row))
			this.insertedRows = []
			this.deletedRows = []
			this.updatedRows = []

			this.getData()
			this.$refs.filterBar.doFilter()
		},
		format(date) {
			return moment(date).format('DD/MM/YYYY')
		},
		applyTextFilter: async function (text) {
			this.filteredDataset = await this.TechnicianService.getTechniciansList(text)
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
		getPaginatedData: function () {
			if (this.rawDataset.length === 0) {
				return []
			}

			var arraySize = this.rawDataset.length - 1
			var left = (this.currentPage - 1) * this.pageSize
			var right = this.currentPage * this.pageSize
			if (right > arraySize) {
				right = arraySize + 1
			}

			if (left < 0 || left > arraySize) {
				return []
			} else {
				return _.slice(this.filteredDataset, left, right)
			}
		},
		getData: async function () {
			this.rawDataset = await this.TechnicianService.getTechniciansList()
			this.filteredDataset = this.rawDataset
		}
	},
	created() {
		this.TechnicianService = new TechnicianService()
	},
	mounted() {
		this.getData()
	}
}
</script>