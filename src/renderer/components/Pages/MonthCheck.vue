<template>
	<div class="container-fluid">
		<div class="row">
			<div class="col-md-5">
				<h1>Cierre - {{monthName}} {{year}}</h1>
			</div>
			<!-- col-md-5 -->
			<div class="col-md-7 mt-2">
				<div class="float-right">
					<collapsible-action-button
						iconCss="fas fa-clipboard-list"
						text="Modo verificación (sólo lectura)"
						:callback="setReadOnly"
						v-if="!readOnly"
					></collapsible-action-button>
					<collapsible-action-button
						iconCss="fas fa-check"
						text="Modo normal"
						:callback="unsetReadOnly"
						v-else-if="!dbReadOnly"
					></collapsible-action-button>
					<collapsibleExcelButton
						fileName="cierreMensual"
						:isCollapsible="true"
						:collapsed="false"
						:isDark="false"
						ref="excelButton"
						:class="{'displayNone': !readOnly}"
						@click="beginExporting"
					></collapsibleExcelButton>
					<button
						class="btn btn-warning"
						:disabled="selectedDentists.length === 0"
						@click="generateReport"
						v-if="!readOnly"
					>
						<i class="fas fa-receipt mr-2"></i>Generar resúmenes
					</button>
					<button
						class="btn btn-warning"
						:disabled="selectedDentists.length === 0"
						@click="generateInvoice"
						v-if="!readOnly"
					>
						<i class="fas fa-file-invoice-dollar mr-2"></i>Generar facturas
					</button>
				</div>
			</div>
			<!-- col-md-7 -->
		</div>
		<!-- row -->
		<div class="row">
			<div class="col-md-12">
				<p
					class="text-justify"
					v-if="!readOnly"
				>Aquí figuran los datos de los trabajos del mes agrupados por dentista. Para generar una factura hay que seleccionar los dentistas a los que deseemos emitirle factura (marcando su cuadro de selección) y pulsar el botón Generar facturas. Para poder marcar un dentista hay que marcar previamente alguno sus trabajos. Una vez generada la correspondiente factura, los trabajos ya no aparecerán en esta lista. Si todos los trabajos de un dentista ya estuvieran incorporados a una factura, tampoco aparecería el propio dentista en este listado.</p>
				<p
					class="text-justify"
					v-else
				>Aquí figuran todos los datos de los trabajos del mes agrupados por dentista. Este modo de verificación permite comprobar la asignación de trabajos y facturas, agrupadas por dentista. Sin embargo, en este modo no se pueden asignar trabajos a nuevas facturas.</p>
			</div>
			<!-- col-md-12 -->
		</div>
		<!-- row -->
		<div class="row">
			<monthCheckExtendedTable
				:headers="headers"
				:searchFields="[]"
				ref="theTable"
				urlBase="/works/details/"
				:year="year"
				:month="month"
				masterKey="IdDentista"
				v-model="selectedDentists"
			/>
		</div>
		<!-- row -->
		<b-modal ref="modal" size="lg" title="Emisión de facturas" hide-footer>
			<div class="modal-body">
				<div class="containter">
					<div class="row">
						<div class="col-md-12">
							<span>Se van a emitir facturas para los siguientes clientes. Por favor, verifique que los datos de los posibles descuentos aplicados son correctos. Una vez emitidas las facturas, se podrán consultar y volver a imprimir desde la sección Facturas del área de Gestión Económica.</span>
							<ul class="pt-3">
								<li
									v-for="dentist in selectedDentists"
									v-bind:key="dentist.IdDentista"
								>{{dentist.NombreDentista}} | Importe base: {{sumBasePrice(dentist)}} | Dto.: {{sumDiscounts(dentist)}} | Total factura: {{sumTotals(dentist)}}</li>
							</ul>
						</div>
						<!-- col-md-12 -->
					</div>
					<!-- row -->
					<div class="row" v-if="!generateInvoiceInProgress">
						<div class="col-md-6">
							<label for="fechaFacturas">Verifique la fecha de las facturas a emitir:</label>
							<input
								type="date"
								class="form-control"
								id="fechaFacturas"
								placeholder="dd/mm/aaaa"
								v-model="invoiceDate"
							/>
						</div>
						<!-- col-md-6 -->
					</div>
					<!-- row -->
					<div class="row" v-if="generateInvoiceInProgress">
						<div class="col-md-12 pt-2 pb-3">
							Procesando...
							<div class="progress">
								<div
									class="progress-bar bg-info"
									:style="'width:' + currentProgress +'%'"
								>{{currentProgress}}%</div>
							</div>
						</div>
						<!-- col-md-12 -->
					</div>
					<!-- row -->
				</div>
				<!-- containter -->
			</div>
			<!-- modal-body -->
			<div class="modal-footer">
				<button class="btn btn-secondary" @click="hideModal">
					<i class="fas fa-times-circle mr-2 position-relative" style="top: 1px;"></i>Cancelar
				</button>
				<button
					class="btn btn-secondary"
					@click="confirmGeneration(false)"
					ref="btnPrint"
					:disabled="invoiceDate === ''"
				>
					<i class="fas fa-file-invoice-dollar mr-2"></i>Generar facturas
				</button>
				<button
					class="btn btn-secondary"
					@click="confirmGeneration(true)"
					ref="btnPrint"
					:disabled="invoiceDate === ''"
				>
					<i class="fas fa-print mr-2"></i>Generar e imprimir facturas
				</button>
			</div>
		</b-modal>
		<b-modal ref="modalReport" size="lg" title="Emisión de resúmenes" hide-footer>
			<div class="modal-body">
				<div class="containter">
					<div class="row">
						<div class="col-md-12">
							<span>Se van a emitir resúmenes para los siguientes clientes.</span>
							<ul class="pt-3">
								<li
									v-for="dentist in selectedDentists"
									v-bind:key="dentist.IdDentista"
								>{{dentist.NombreDentista}} | Importe base: {{sumBasePrice(dentist)}} | Dto.: {{sumDiscounts(dentist)}} | Total: {{sumTotals(dentist)}}</li>
							</ul>
						</div>
						<!-- col-md-12 -->
					</div>
					<!-- row -->
					<div class="row" v-if="generateReportInProgress">
						<div class="col-md-12 pt-2 pb-3">
							Procesando...
							<div class="progress">
								<div
									class="progress-bar bg-info"
									:style="'width:' + currentProgress +'%'"
								>{{currentProgress}}%</div>
							</div>
						</div>
						<!-- col-md-12 -->
					</div>
					<!-- row -->
				</div>
				<!-- containter -->
			</div>
			<!-- modal-body -->
			<div class="modal-footer">
				<button class="btn btn-secondary" @click="hideReportModal">
					<i class="fas fa-times-circle mr-2 position-relative" style="top: 1px;"></i>Cancelar
				</button>
				<button class="btn btn-secondary" @click="printReport">
					<i class="fas fa-print mr-2"></i>Imprimir resúmenes
				</button>
			</div>
		</b-modal>
		<invoicePrint ref="invoice"></invoicePrint>
	</div>
</template>

<script>
import monthCheckExtendedTable from '../PageElements/tables/monthCheckExtendedTable'
import collapsibleActionButton from '../PageElements/CollapsibleButtons/collapsibleActionButton'
import invoicePrint from '../Labels/InvoicePrint'
// eslint-disable-next-line
import { bTooltip, bModal } from 'bootstrap-vue'
import _ from 'lodash'
import moment from 'moment'
import InvoiceService from '../../../services/InvoiceService.js'
import collapsibleExcelButton from '../PageElements/CollapsibleButtons/collapsibleExcelButton'
import log from 'loglevel'

export default {
	name: 'monthCheck',
	components: {
		monthCheckExtendedTable,
		collapsibleActionButton,
		collapsibleExcelButton,
		invoicePrint
	},
	data() {
		return {
			headers: [
				{
					title: '',
					dataField: 'estado',
					titleClass: 'text-left small-text column5 align-top',
					rowClass: 'small-text text-right'
				},
				{
					title: 'Dentista',
					dataField: 'NombreDentista',
					titleClass: 'text-left small-text column20 align-top tableexport-string target',
					rowClass: 'small-text tableexport-string target'
				},
				{
					title: 'P. Final',
					dataField: 'SumaPrecioSinDescuento',
					titleClass: 'text-right small-text column5 align-top tableexport-string target',
					rowClass: 'text-right small-text tableexport-number target',
					formatter: 'money'
				},
				{
					title: 'P. Metal',
					dataField: 'SumaAditamentos',
					titleClass: 'text-right small-text column5 align-top tableexport-string target',
					rowClass: 'text-right small-text tableexport-number target',
					formatter: 'money'
				},
				{
					title: 'Cerámica',
					dataField: 'SumaCeramica',
					titleClass: 'text-right small-text column5 align-top tableexport-string target',
					rowClass: 'text-right small-text tableexport-number target',
					formatter: 'money'
				},
				{
					title: 'Resina',
					dataField: 'SumaResina',
					titleClass: 'text-right small-text column5 align-top tableexport-string target',
					rowClass: 'text-right small-text tableexport-number target',
					formatter: 'money'
				},
				{
					title: 'Ortodoncia',
					dataField: 'SumaOrtodoncia',
					titleClass: 'text-right small-text column5 align-top tableexport-string target',
					rowClass: 'text-right small-text tableexport-number target',
					formatter: 'money'
				},
				{
					title: 'Esquelético',
					dataField: 'SumaEsqueletico',
					titleClass: 'text-right small-text column5 align-top tableexport-string target',
					rowClass: 'text-right small-text tableexport-number target',
					formatter: 'money'
				},
				{
					title: 'Zirconio',
					dataField: 'SumaZirconio',
					titleClass: 'text-right small-text column5 align-top tableexport-string target',
					rowClass: 'text-right small-text tableexport-number target',
					formatter: 'money'
				},
				{
					title: 'Fija Metal',
					dataField: 'SumaFija',
					titleClass: 'text-right small-text column5 align-top tableexport-string target',
					rowClass: 'text-right small-text tableexport-number target',
					formatter: 'money'
				},
				{
					title: 'Total Metal',
					dataField: 'SumaTotalMetal',
					titleClass: 'text-right small-text column5 align-top tableexport-string target',
					rowClass: 'text-right small-text tableexport-number target',
					formatter: 'money'
				},
				{
					title: '% Dto.',
					dataField: 'Porcentaje',
					titleClass: 'text-right small-text column5 align-top tableexport-string target',
					rowClass: 'text-right small-text tableexport-number target',
					formatter: 'percentage'
				},
				{
					title: 'Dto.',
					dataField: 'SumaDescuento',
					titleClass: 'text-right small-text column5 align-top tableexport-string target',
					rowClass: 'text-right small-text tableexport-number target',
					formatter: 'money'
				},
				{
					title: 'Total',
					dataField: 'SumaGranTotal',
					titleClass: 'text-right small-text column5 align-top tableexport-string target',
					rowClass: 'text-right small-text tableexport-number target',
					formatter: 'money'
				}
			],
			rows: [],
			year: 0,
			month: 0,
			selectedDentists: [],
			invoiceDate: '',
			generateInvoiceInProgress: false,
			generateReportInProgress: false,
			currentProgress: 0,
			moneyFormatter: new Intl.NumberFormat('es-ES', {
				style: 'currency',
				currency: 'EUR'
			}),
			readOnly: false,
			dbReadOnly: false
		}
	},
	methods: {
		generateInvoice() {
			this.generateInvoiceInProgress = false
			this.currentProgress = 0
			this.invoiceDate = moment(new Date(this.year, this.month, 0)).format('YYYY-MM-DD')
			this.$refs.modal.show()
		},
		generateReport() {
			this.generateInvoiceInProgress = false
			this.currentProgress = 0
			this.invoiceDate = moment(new Date(this.year, this.month, 0)).format('YYYY-MM-DD')
			this.$refs.modalReport.show()
		},
		hideModal() {
			this.$refs.modal.hide()
		},
		hideReportModal() {
			this.$refs.modalReport.hide()
		},
		printReport: function() {
			this.generateReportInProgress = true
			this.currentProgress = 0
			var percentageStep = 100 / this.selectedDentists.length
			for (var dentist of this.selectedDentists) {
				var reportData = dentist
				this.$refs.invoice.printNoInvoice(reportData)
				this.currentProgress = Math.round(this.currentProgress + percentageStep)
			}
			this.$refs.modalReport.hide()
		},
		confirmGeneration: async function(haveToPrint) {
			this.generateInvoiceInProgress = true
			this.currentProgress = 0
			var percentageStep = 100 / this.selectedDentists.length
			for (var dentist of this.selectedDentists) {
				var idInvoice = await this.invoiceService.insertInvoice(
					dentist.IdDentista,
					_.map(dentist.selectedWorks, work => {
						return {
							idTrabajo: work.IdTrabajo,
							totalDescuento: work.TotalDescuento,
							porcentajeDescuento: work.PorcentajeDescuento
						}
					}),
					this.invoiceDate
				)
				log.info(`Invoice ${idInvoice} for dentist ${dentist.IdDentista} generated`)

				if (haveToPrint) {
					this.$refs.invoice.print(idInvoice)
				}
				this.currentProgress = Math.round(this.currentProgress + percentageStep)
			}
			this.hideModal()
			this.$refs.theTable.forceFullReload()
		},
		beginExporting() {
			this.$refs.theTable.beginExporting(this.endExporting)
		},
		endExporting() {
			this.$refs.theTable.forceFullReload()
		},
		setReadOnly() {
			this.readOnly = true
			if (this.$refs.theTable) {
				this.$refs.theTable.setReadOnlyMode(true)
				this.$refs.theTable.forceFullReload()
				this.$refs.theTable.forceTableHeaderReflow()
			}
		},
		unsetReadOnly() {
			this.readOnly = false
			this.$refs.theTable.setReadOnlyMode(false)
			this.$refs.theTable.forceFullReload()
			this.$refs.theTable.forceTableHeaderReflow()
		},
		sumBasePrice: function(dentistData) {
			var total = 0
			for (var work of dentistData.selectedWorks) {
				total += parseFloat(work.SumaPrecioSinDescuento)
			}
			return this.moneyFormatter.format(total)
		},
		sumDiscounts: function(dentistData) {
			var total = 0
			for (var work of dentistData.selectedWorks) {
				total += parseFloat(work.TotalDescuento)
			}
			return this.moneyFormatter.format(total)
		},
		sumTotals: function(dentistData) {
			var total = 0
			for (var work of dentistData.selectedWorks) {
				total += parseFloat(work.SumaPrecioConDescuento)
			}
			return this.moneyFormatter.format(total)
		}
	},
	computed: {
		monthName: function() {
			var objDate = new Date()
			objDate.setMonth(this.month - 1)
			return objDate.toLocaleString('es-es', { month: 'long' })
		}
	},
	created() {
		this.invoiceService = new InvoiceService()
		this.year = this.$route.params.year
		this.month = this.$route.params.month
		// No operation was made with the db in the invoiceService, so we have to take the
		// readonly parameter directly from the configFileService
		this.dbReadOnly = this.invoiceService.configFileService.configGet('readonly')
		if (this.dbReadOnly) {
			this.setReadOnly()
		}
	},
	mounted() {
		this.$refs.excelButton.setTable(this.$refs.theTable)
	}
}
</script>
