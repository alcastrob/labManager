<template>
  <div class="table-responsive">
    <float-thead-table class="table table-bordered" :top="56" ref="table" :autoReflow="true">
      <thead>
        <tr v-if="!isExporting">
          <th
            v-for="header in headers"
            v-bind:key="header.dataField"
            v-bind:class="header.titleClass"
          >
            {{header.title}}
            <br />
            {{subheaders[header.dataField]}}
          </th>
        </tr>
        <tr v-else>
          <th
            v-for="header in headers"
            v-bind:key="header.dataField"
            v-bind:class="header.titleClass"
          >{{header.title}} - {{subheaders[header.dataField]}}</th>
        </tr>
      </thead>
      <tbody>
        <!-- The rows of the dentists -->
        <template v-for="dentist in rawDataset">
          <tr
            v-bind:key="'dentist-' + dentist.IdDentista"
            v-on:click="toggleWorksRows($event, dentist.IdDentista)"
          >
            <template v-for="column in headers">
              <td
                v-bind:key="'b' + column.dataField"
                :class="column.rowClass"
                class="tableexport-string target"
              >
                <input
                  type="checkbox"
                  v-if="isButton(column.dataField) && !isExporting"
                  @change="forceSomeWorksChechedBeforeCheckingTheDentist($event, dentist.IdDentista)"
                  :id="'chkDentist-' + dentist.IdDentista"
                  tabindex="-1"
                />

                <div v-else-if="!isExporting">
                  <span>{{formatRow(dentist[column.dataField], column.formatter)}}</span>

                  <b-badge
                    variant="secondary"
                    class="position-relative"
                    style="top:-7px"
                    v-if="column.dataField === 'NombreDentista' && !isExporting"
                  >{{remainingWorks[dentist.IdDentista]}}</b-badge>

                  <span
                    v-if="column.dataField === 'NombreDentista' && isReadOnly && (invoicesPerDentist[dentist.IdDentista] !== undefined && invoicesPerDentist[dentist.IdDentista] !== [])"
                  >
                    <span
                      v-for="invoice in invoiceIdsOfDentist(invoicesPerDentist[dentist.IdDentista])"
                      v-bind:key="invoice.IdTrabajo"
                    >
                      -
                      <router-link
                        :to="'/finances/invoices/' + invoice.IdFactura"
                        tabindex="-1"
                      >{{invoice.NumFactura}}</router-link>
                    </span>
                  </span>
                </div>
                <div v-else>
                  {{formatForExcel(dentist, column)}}
                  <!-- {{formatRow(dentist[column.dataField], column.formatter)}} -->
                </div>
              </td>
            </template>
          </tr>
          <!-- The rows of the works -->
          <template v-for="work in worksPerDentist[dentist.IdDentista]">
            <transition name="fade" v-bind:key="'trans-' + work.IdTrabajo">
              <tr
                v-bind:key="'work-' + work.IdTrabajo"
                v-if="selectedDentist === dentist.IdDentista"
                class="deaggregated"
                @click="clickedWork($event, dentist.IdDentista, work.IdTrabajo)"
              >
                <td
                  class="small-text text-right"
                  :class="{'strikethrough': work.Chequeado, 'bold': !work.Chequeado}"
                >
                  {{work.IdTrabajo}}&nbsp;
                  <input
                    type="checkbox"
                    v-model="work.Chequeado"
                    @change="updateDentistCheckbox(dentist.IdDentista)"
                    tabindex="-1"
                  />
                </td>

                <td
                  class="dentist-text column-20 tableexport-string target"
                  :class="{'strikethrough': work.Chequeado, 'bold': !work.Chequeado}"
                >
                  {{work.Paciente}}&nbsp;|&nbsp;{{formatDate(work, 'FechaTerminacion')}}&nbsp;|&nbsp;
                  <router-link
                    :to="'/works/details/' + work.IdTrabajo"
                    role="button"
                    :id="'tooltipTarget' + work.IdTrabajo"
                    tabindex="-1"
                  >Ver</router-link>

                  <span
                    v-if="isReadOnly && invoicesPerDentist[dentist.IdDentista] !== undefined && invoicesPerDentist[dentist.IdDentista].length !== 0 && invoiceOfWork(invoicesPerDentist[dentist.IdDentista], work.IdTrabajo) !== undefined"
                  >
                    &nbsp;|&nbsp;
                    <router-link
                      :to="'/finances/invoices/' + invoiceOfWork(invoicesPerDentist[dentist.IdDentista], work.IdTrabajo).IdFactura"
                      tabindex="-1"
                    >{{invoiceOfWork(invoicesPerDentist[dentist.IdDentista], work.IdTrabajo).NumFactura}}</router-link>
                  </span>
                  <b-tooltip
                    :target="'tooltipTarget' + work.IdTrabajo"
                    placement="right"
                    delay="500"
                  >
                    <div class="text-left">
                      Tipo:
                      <i
                        class="fas fa-bookmark"
                        :class="work.TipoTrabajo.toLowerCase() + '-color'"
                      ></i>
                      {{work.TipoTrabajo}}
                      <br />
                      Color: {{work.Color}}
                      <br />
                      Fecha Entrada: {{formatDate(work, 'FechaEntrada')}}
                      <br />Indicaciones:
                      <br />
                      <ul
                        v-for="indication in workIndications[work.IdTrabajo]"
                        v-bind:key="indication.IdTrabajoDetalle"
                      >
                        <li>({{indication.Cantidad}}x) {{indication.Descripcion}} | {{moneyFormatter.format(indication.Precio)}}</li>
                      </ul>
                    </div>
                  </b-tooltip>
                </td>

                <td
                  class="small-text text-right"
                  :class="{'strikethrough': work.Chequeado, 'bold': !work.Chequeado}"
                >{{moneyFormatter.format(work.SumaPrecioSinDescuento)}}</td>
                <td
                  class="small-text text-right"
                  :class="{'strikethrough': work.Chequeado, 'bold': !work.Chequeado}"
                >{{moneyFormatter.format(work.SumaAditamentos)}}</td>
                <td
                  class="small-text text-right"
                  :class="{'strikethrough': work.Chequeado, 'bold': !work.Chequeado}"
                >{{moneyFormatter.format(work.SumaCeramica)}}</td>
                <td
                  class="small-text text-right"
                  :class="{'strikethrough': work.Chequeado, 'bold': !work.Chequeado}"
                >{{moneyFormatter.format(work.SumaResina)}}</td>
                <td
                  class="small-text text-right"
                  :class="{'strikethrough': work.Chequeado, 'bold': !work.Chequeado}"
                >{{moneyFormatter.format(work.SumaOrtodoncia)}}</td>
                <td
                  class="small-text text-right"
                  :class="{'strikethrough': work.Chequeado, 'bold': !work.Chequeado}"
                >{{moneyFormatter.format(work.SumaEsqueletico)}}</td>
                <td
                  class="small-text text-right"
                  :class="{'strikethrough': work.Chequeado, 'bold': !work.Chequeado}"
                >{{moneyFormatter.format(work.SumaZirconio)}}</td>
                <td
                  class="small-text text-right"
                  :class="{'strikethrough': work.Chequeado, 'bold': !work.Chequeado}"
                >{{moneyFormatter.format(work.SumaFija)}}</td>
                <td
                  class="small-text text-right"
                  :class="{'strikethrough': work.Chequeado, 'bold': !work.Chequeado}"
                >{{moneyFormatter.format(work.SumaTotalMetal)}}</td>
                <td
                  class="noMargins"
                  :class="{'strikethrough': work.Chequeado, 'bold': !work.Chequeado}"
                >
                  <percentageInput
                    class="inputInTd small-text text-right"
                    :class="{'strikethrough': work.Chequeado, 'bold': !work.Chequeado}"
                    v-model="work.PorcentajeDescuento"
                    :disabled="isReadOnly"
                    @change="percentageDiscountChanged(work, dentist)"
                  ></percentageInput>
                </td>
                <td
                  class="noMargins"
                  :class="{'strikethrough': work.Chequeado, 'bold': !work.Chequeado}"
                >
                  <euroInput
                    class="inputInTd small-text text-right"
                    :class="{'strikethrough': work.Chequeado, 'bold': !work.Chequeado}"
                    v-model="work.TotalDescuento"
                    :disabled="isReadOnly"
                    @change="totalDiscountChanged(work, dentist)"
                  ></euroInput>
                </td>
                <td
                  class="small-text text-right noMargins"
                  :class="{'strikethrough': work.Chequeado, 'bold': !work.Chequeado}"
                >{{moneyFormatter.format(work.SumaPrecioConDescuento)}}</td>
              </tr>
            </transition>
          </template>
        </template>
      </tbody>
    </float-thead-table>
  </div>
</template>
<script>
'use strict'

import Vue from 'vue'
import FloatThead from 'vue-floatthead'
import _ from 'lodash'
import log from 'loglevel'
import moment from 'moment'
import tableMixin from './tableMixin'
// eslint-disable-next-line
import clearbBadge from 'bootstrap-vue'
import InvoiceService from '../../../../services/InvoiceService'
import MonthCheckService from '../../../../services/MonthCheckService'
import WorkService from '../../../../services/WorkService'
import WorkIndicationService from '../../../../services/WorkIndicationService'
import euroInput from '../tables/euroInput'
import percentageInput from '../tables/percentageInput'

Vue.use(FloatThead)

var moneyFormatter = new Intl.NumberFormat('es-ES', {
	style: 'currency',
	currency: 'EUR'
})

export default {
	name: 'monthCheckExtendedTable',
	mixins: [tableMixin],
	components: {
		FloatThead,
		euroInput,
		percentageInput
	},
	props: {
		year: {
			type: String,
			required: true
		},
		month: {
			type: String,
			required: true
		},
		value: {
			type: Array,
			required: false
		}
	},
	data() {
		return {
			// The sums of all the dataset(grouped by column, i.e. SumaFija, SumaOrtodoncia...)
			sums: {},

			// A mapping of column indexes and column names
			columnIndex: {},

			// The sum values that are contained on the column headers (including the money format)
			subheaders: {},

			// The all work entities, grouped by dentistId
			worksPerDentist: {},

			// All the invoices related with this month, grouped by dentistId
			invoicesPerDentist: {},

			// The count of works without the check, grouped by dentist (used by the badges)
			remainingWorks: {},

			// The dentistId that currently is selected
			selectedDentist: 0,

			// The indications of every work in the dataset (used by tooltips)
			workIndications: {},

			// The dentistId of the dentists with the checkbox set
			dentistsChecked: [],

			// If true, the table will show ALL the dentists and works, regardless they where associated to an invoice or not
			isReadOnly: false
		}
	},
	methods: {
		// Event responses----------------------------
		toggleWorksRows(event, idDentist) {
			this.$forceUpdate()
			if (event.srcElement.localName !== 'input') {
				if (this.selectedDentist !== idDentist) {
					this.selectedDentist = idDentist
				} else {
					this.selectedDentist = 0
				}
			}
		},
		clickedWork(event, idDentist, idTrabajo) {
			var works = this.worksPerDentist[idDentist]
			if (event.srcElement.localName !== 'textarea' && event.srcElement.localName !== 'a') {
				var work = _.find(works, ['IdTrabajo', idTrabajo])
				work.Chequeado = !work.Chequeado
				this.monthCheckService.setCheckToWork(idTrabajo, work.Chequeado)
				this.updateDentistCheckbox(idDentist)
			}
		},
		percentageDiscountChanged(work, dentist) {
			// We prevent accidental changes of the discounts in works that could be part of an invoice. Only it's allowed to edit in read/write mode.
			if (!this.isReadOnly) {
				if (work.SumaTotalMetal === 0) {
					work.TotalDescuento = 0
					work.PorcentajeDescuento = 0
					work.SumaPrecioConDescuento = work.SumaPrecioSinDescuento
				} else {
					work.TotalDescuento = parseFloat(parseFloat((work.SumaTotalMetal * work.PorcentajeDescuento) / 100).toFixed(2))
					work.SumaPrecioConDescuento = work.SumaPrecioSinDescuento - work.TotalDescuento
				}
				this.applyDiscountsToDentist(dentist)
				this.workService.updateWorkDiscount(
					work.IdTrabajo,
					work.PorcentajeDescuento,
					work.TotalDescuento,
					work.SumaPrecioConDescuento
				)
			}
		},
		totalDiscountChanged(work, dentist) {
			// We prevent accidental changes of the discounts in works that could be part of an invoice. Only it's allowed to edit in read/write mode.
			if (!this.isReadOnly) {
				if (work.SumaTotalMetal === 0) {
					work.TotalDescuento = 0
					work.PorcentajeDescuento = 0
					work.SumaPrecioConDescuento = work.SumaPrecioSinDescuento
				} else {
					work.PorcentajeDescuento = parseFloat(parseFloat((work.TotalDescuento * 100) / work.SumaTotalMetal).toFixed(2))
					work.SumaPrecioConDescuento = work.SumaPrecioSinDescuento - work.TotalDescuento
				}
				this.applyDiscountsToDentist(dentist)
				this.workService.updateWorkDiscount(
					work.IdTrabajo,
					work.PorcentajeDescuento,
					work.TotalDescuento,
					work.SumaPrecioConDescuento
				)
			}
		},

		// Calculations-------------------------------
		calculateRemainingWorks(works) {
			var remainingCandidates = _.filter(works, function(w) {
				return w.Chequeado === 0 || w.Chequeado === false
			})
			return remainingCandidates.length === 0 ? '' : remainingCandidates.length
		},
		calcProductTotal: function(work) {
			return moneyFormatter.format(work.SumaPrecioConDescuento)
		},
		calcColumnSums: function(includedColumns) {
			log.debug('Calculating the sum of columns')
			for (var column of this.headers) {
				var columnName = column.dataField
				if (includedColumns.includes(columnName)) {
					this.sums[columnName] = 0
					this.columnIndex[columnName] = _.findIndex(this.headers, ['dataField', columnName])
				}
			}
			log.debug(`rawDataset length: ${this.rawDataset.length}`)
			for (var row of this.rawDataset) {
				for (var field in row) {
					if (includedColumns.includes(field)) {
						this.sums[field] += row[field]
					}
				}
			}
			log.debug(`Calculated sums of columns: ${JSON.stringify(this.sums)}`)
			for (var column of this.headers) {
				if (includedColumns.includes(column.dataField)) {
					this.subheaders[column.dataField] = moneyFormatter.format(this.sums[column.dataField])
				}
			}
		},
		applyDiscountsToDentist: function(dentist) {
			dentist.SumaDescuento = 0
			dentist.SumaGranTotal = 0

			for (var currentWork of this.worksPerDentist[dentist.IdDentista]) {
				dentist.SumaDescuento += parseFloat(currentWork.TotalDescuento)
				dentist.SumaGranTotal += parseFloat(currentWork.SumaPrecioConDescuento)
			}

			if (dentist.SumaPrecioSinDescuento === 0) {
				dentist.Porcentaje = (0).toFixed(2)
			} else {
				dentist.Porcentaje = (
					(100 * (dentist.SumaPrecioSinDescuento - dentist.SumaGranTotal)) /
					dentist.SumaTotalMetal
				).toFixed(2)
			}
			dentist.Porcentaje = parseFloat(dentist.Porcentaje)
			this.calcColumnSums(['SumaDescuento', 'SumaGranTotal'])
		},

		// Verifications------------------------------
		isAnyWorkOfDentistChecked(idDentist) {
			return _.some(this.worksPerDentist[idDentist], function(w) {
				return w.Chequeado !== 0 && w.Chequeado !== false
			})
		},
		isButton: function(field) {
			return field === 'estado'
		},

		// Updates and manipulation of the UI---------
		forceSomeWorksChechedBeforeCheckingTheDentist(event, idDentist) {
			this.selectedDentist = idDentist
			this.$forceUpdate()
			if (!this.isAnyWorkOfDentistChecked(idDentist)) {
				event.srcElement.checked = false
			}
			if (event.srcElement.checked) {
				if (
					_.find(this.dentistsChecked, d => {
						return d === idDentist
					}) === undefined
				) {
					this.dentistsChecked.push(idDentist)
				}
			} else {
				this.dentistsChecked = _.remove(this.dentistsChecked, function(d) {
					return d !== idDentist
				})
			}
			// Send the data to the v-model of the container
			this.emitDataBack()
		},
		updateDentistCheckbox(idDentist) {
			var areChecked = this.isAnyWorkOfDentistChecked(idDentist)
			document.getElementById('chkDentist-' + idDentist).checked = areChecked
			if (areChecked) {
				if (
					_.find(this.dentistsChecked, d => {
						return d === idDentist
					}) === undefined
				) {
					this.dentistsChecked.push(idDentist)
				}
			} else {
				this.dentistsChecked = _.remove(this.dentistsChecked, d => {
					return d !== idDentist
				})
			}
			// Updates the count of the badge
			this.remainingWorks[idDentist] = this.calculateRemainingWorks(this.worksPerDentist[idDentist])
			this.$forceUpdate()

			// Send the data to the v-model of the container
			this.emitDataBack()
		},
		uncheckAllDentistCheckbox() {
			for (var dentist of this.dentistsChecked) {
				document.getElementById('chkDentist-' + dentist).checked = false
			}
			this.dentistsChecked = []
		},
		emitDataBack() {
			var returnedValue = []
			for (var dentistId of this.dentistsChecked) {
				var dentistData = _.find(this.rawDataset, ['IdDentista', dentistId])
				var dentistWorks = _.filter(this.worksPerDentist[dentistId], o => {
					return o.Chequeado === true || o.Chequeado === 1
				})

				returnedValue.push({
					IdDentista: dentistId,
					NombreDentista: dentistData.NombreDentista,
					selectedWorks: dentistWorks
				})
			}
			this.$emit('input', returnedValue)
		},
		forceFullReload() {
			this.getWorksAggregated(this.year, this.month)
			this.uncheckAllDentistCheckbox()
		},
		forceTableHeaderReflow() {
			this.$refs.table.reflow()
		},
		setReadOnlyMode(isReadOnly) {
			this.isReadOnly = isReadOnly
		},
		invoiceIdsOfDentist(invoice) {
			if (invoice.length === 0 || invoice === undefined) {
				return []
			} else {
				return _.uniqBy(invoice, 'NumFactura')
			}
		},
		invoiceOfWork(invoices, workId) {
			if (invoices.length === 0) {
				return ''
			} else {
				return _.find(invoices, ['IdTrabajo', workId])
			}
		},
		formatDate(row, field) {
			var returnedValue = moment(row[field]).format('DD/MM/YYYY')
			if (returnedValue !== 'Invalid date') {
				return returnedValue
			} else {
				return ''
			}
		},
		formatForExcel(dentist, column) {
			if (column.dataField === 'NombreDentista') {
				var dentistName = dentist[column.dataField]
				for (var invoice of this.invoiceIdsOfDentist(this.invoicesPerDentist[dentist.IdDentista])) {
					dentistName += ` | ${invoice.NumFactura}`
				}
				return dentistName
			} else {
				return dentist[column.dataField]
			}
		},

		// Persistence--------------------------------
		getWorksOfDentist: async function(idDentist) {
			var works = await this.monthCheckService.getWorksDeaggregatedByDentist(
				parseInt(this.year),
				parseInt(this.month),
				idDentist,
				this.isReadOnly
			)
			if (works.length > 0) {
				// var idDentist = works[0].IdDentista
				this.worksPerDentist[idDentist] = works
				this.remainingWorks[idDentist] = this.calculateRemainingWorks(works)
				for (var work of works) {
					this.getWorkIndications(work.IdTrabajo)
				}
				this.$forceUpdate()
				return works
			}
		},
		getWorkIndications: async function(idTrabajo) {
			var workIndications = await this.workIndicationService.getWorkIndications(idTrabajo)
			if (workIndications.length > 0) {
				// var idTrabajo = workIndications[0].IdTrabajo
				this.workIndications[idTrabajo] = workIndications
			}
		},
		getWorksAggregated: async function(year, month) {
			this.rawDataset = await this.monthCheckService.getWorksAggregatedByDentist(
				parseInt(year),
				parseInt(month),
				this.isReadOnly
			)
			this.calcColumnSums([
				'SumaPrecioSinDescuento',
				'SumaAditamentos',
				'SumaCeramica',
				'SumaResina',
				'SumaOrtodoncia',
				'SumaEsqueletico',
				'SumaZirconio',
				'SumaFija',
				'SumaTotalMetal',
				'SumaDescuento',
				'SumaGranTotal'
			])

			for (var dentist of this.rawDataset) {
				await this.getWorksOfDentist(dentist.IdDentista)
				if (this.isReadOnly) {
					this.invoicesPerDentist[dentist.IdDentista] = await this.invoiceService.getInvoicesPerDentist(
						year,
						month,
						dentist.IdDentista
					)
				}
			}
			this.$forceUpdate()
		}
	},
	created() {
		this.invoiceService = new InvoiceService()
		this.monthCheckService = new MonthCheckService()
		this.workService = new WorkService()
		this.workIndicationService = new WorkIndicationService()
	},
	mounted() {
		this.getWorksAggregated(this.year, this.month)
	}
}
</script>
<style>
.fade-enter-active {
	transition: opacity 0.5s;
}
.fade-leave-active {
	transition: opacity 0.06s;
}
.fade-enter {
	opacity: 0;
}
.fade-leave-to {
	opacity: 1;
}
.strikethrough {
	font-weight: normal;
	text-decoration: line-through;
	background-color: #f9dbd4;
}

.small-text {
	font-size: 0.8em;
	padding-left: 3px !important;
	padding-right: 2px !important;
	padding-top: 5px !important;
	padding-bottom: 5px !important;
	vertical-align: text-top;
	resize: none;
	overflow: hidden;
}
.dentist-text {
	font-size: 0.8em;
	font-style: italic;
	padding-left: 15px !important;
	padding-right: 3px !important;
	padding-top: 5px !important;
	padding-bottom: 5px !important;
}

.column20 {
	width: 20%;
}
.column7 {
	width: 7%;
}
.column5 {
	width: 5%;
}
.column3 {
	width: 3%;
}
</style>