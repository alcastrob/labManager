<template>
	<div ref="container" :class="{ visuallyhidden: forPrinter }"></div>
</template>

<script>
import Vue from 'vue'
import _ from 'lodash'
import { Printd } from 'printd'
import invoicePage from './invoicePage'
import reportPage from './reportPage'
import DentistService from '../../../services/DentistService'
import InvoiceService from '../../../services/InvoiceService'
import WorkService from '../../../services/WorkService'
import WorkIndicationService from '../../../services/WorkIndicationService'
var path = require('path')
var fs = require('fs')

const MAX_NUMBER_OF_LINES_PER_PAGE = 35

export default {
	name: 'invoicePrint',
	components: {
		invoicePage,
		reportPage
	},
	data() {
		return {
			invoice: {},
			invoiceWorks: [],
			indications: [],
			moneyFormatter: new Intl.NumberFormat('es-ES', {
				style: 'currency',
				currency: 'EUR'
			}),
			cssText: '',
			logo: '',
			vatNumber: '',
			footer: '',
			pageLogosLoaded: {},
			instances: [],
			invoiceId: -1,
			forPrinter: true,
			editing: false
		}
	},
	methods: {
		loadInvoiceData: async function(invoiceId) {
			if (!invoiceId) {
				throw 'Missing required parameter invoiceId on call to print method of InvoicePrint.vue'
			}

			this.invoiceId = invoiceId
			var x = await this.invoiceService.getInvoice(this.invoiceId)
			this.invoice = x.invoice
			this.invoiceWorks = x.invoiceWorks

			for (var work of this.invoiceWorks) {
				this.indications[work.IdTrabajo] = await this.workIndicationService.getWorkIndications(work.IdTrabajo)
			}
		},
		renderContent: function(isInvoice) {
			if (this.invoice === {}) {
				this.loadInvoiceData()
			}
			this.pageLogosLoaded = {}

			this.instances = []
			var currentPageLines = 0
			var currentPage = 1

			var worksToPrint = []
			var indicationsToPrint = []

			// Do some calculations related with discounts.
			var appliedDiscount = _.sumBy(this.invoiceWorks, work => {
				return work.TotalDescuento
			})
			var pfcd = _.sumBy(this.invoiceWorks, work => {
				return work.PrecioConDescuento
			})
			var psd = _.sumBy(this.invoiceWorks, work => {
				return work.PrecioSinDescuento
			})
			var appliedPercentageDiscount = 100 * (1 - pfcd / psd)

			for (var currentWork of this.invoiceWorks) {
				if (this.forPrinter) {
					var toAdd = 2 + this.indications[currentWork.IdTrabajo].length
					if (currentPageLines + toAdd <= MAX_NUMBER_OF_LINES_PER_PAGE) {
						worksToPrint.push(currentWork)
						indicationsToPrint[currentWork.IdTrabajo] = this.indications[currentWork.IdTrabajo]
						currentPageLines += toAdd
					} else {
						this.insertInstance(
							worksToPrint,
							indicationsToPrint,
							currentPage,
							false,
							isInvoice,
							appliedDiscount,
							appliedPercentageDiscount
						)
						// Now we reset the arrays and include the current work in the next page
						currentPage++
						worksToPrint = [currentWork]
						indicationsToPrint = []
						indicationsToPrint[currentWork.IdTrabajo] = this.indications[currentWork.IdTrabajo]
						currentPageLines = 2 + this.indications[currentWork.IdTrabajo].length
					}
				} else {
					worksToPrint.push(currentWork)
					indicationsToPrint[currentWork.IdTrabajo] = this.indications[currentWork.IdTrabajo]
				}
			}

			if (indicationsToPrint.length !== 0) {
				// We have something to print on the last page
				this.insertInstance(
					worksToPrint,
					indicationsToPrint,
					currentPage,
					true,
					isInvoice,
					appliedDiscount,
					appliedPercentageDiscount
				)
			}
		},
		print: async function(invoiceId) {
			this.dataReset()
			this.forPrinter = true
			await this.loadInvoiceData(invoiceId)
			this.renderContent(true)
			this.realPrint()
		},
		printNoInvoice: async function(invoiceData) {
			this.dataReset()
			this.forPrinter = true

			this.invoice = await this.dentistService.getDentist(invoiceData.IdDentista)
			this.invoice.Total = 0
			this.invoiceWorks = invoiceData.selectedWorks
			for (var work of this.invoiceWorks) {
				this.indications[work.IdTrabajo] = await this.workIndicationService.getWorkIndications(work.IdTrabajo)
				work.PrecioSinDescuento = work.SumaPrecioSinDescuento
				work.PrecioConDescuento = work.SumaPrecioConDescuento
				this.invoice.Total += work.PrecioConDescuento
			}

			this.renderContent(false)
			this.realPrint()
		},
		show: async function(invoiceId, editing = false) {
			this.dataReset()
			this.forPrinter = false
			await this.loadInvoiceData(invoiceId)
			this.editing = editing
			this.renderContent(true)
		},
		insertInstance(
			worksToPrint,
			indicationsToPrint,
			currentPage,
			isLastPage,
			isInvoice,
			appliedDiscount = 0,
			appliedPercentageDiscount = 0
		) {
			var ComponentClass
			if (isInvoice) {
				ComponentClass = Vue.extend(invoicePage)
			} else {
				ComponentClass = Vue.extend(reportPage)
			}
			this.pageLogosLoaded[currentPage] = false

			var instance = new ComponentClass({
				propsData: {
					invoice: this.invoice,
					// The array must be cloned for this specific page
					works: worksToPrint.slice(0),
					indications: indicationsToPrint.slice(0),
					isFirstPage: currentPage === 1,
					isLastPage: isLastPage,
					pageNumber: currentPage,
					cssText: this.cssText,
					logo: this.logo,
					vatNumber: this.vatNumber,
					footer: this.footer,
					forPrinter: this.forPrinter,
					editing: this.editing,
					appliedDiscount: appliedDiscount,
					appliedPercentageDiscount: appliedPercentageDiscount
				}
			})
			// In order to receive messages from the topbar, the $root property must be the same as the InvoicePrint root, not the InvoicePrinter itseft.
			instance.$root = this.$root
			this.instances.push(instance)
			instance.$mount()
			// This is required for isDirty exploration of TopBar component
			instance.$parent = this
			this.$children.push(instance)
			instance.waitLogo(this.waitLogoCallback)
			this.$refs.container.appendChild(instance.$el)
		},
		waitLogoCallback(pageNumber) {
			this.pageLogosLoaded[pageNumber] = true
		},
		realPrint() {
			// This method is intended to be used only when all the logos of the invoicePage components are fully loaded
			if (
				_.every(Object.values(this.pageLogosLoaded), val => {
					return val
				})
			) {
				const d = new Printd()
				d.print(this.$el, this.cssText)

				for (var currentInstance of this.instances) {
					this.$refs.container.removeChild(currentInstance.$el)
				}
			} else {
				window.setTimeout(this.realPrint, 500)
			}
		},
		loadData: async function() {
			var config = await this.invoiceService.getConfigValues(['logo', 'vatNumber', 'invoiceFooter'])
			this.logo = 'data:image/png;base64,' + _.find(config, ['clave', 'logo']).valor
			this.vatNumber = _.find(config, ['clave', 'vatNumber']).valor
			this.footer = _.find(config, ['clave', 'invoiceFooter']).valor
		},
		dataReset: function() {
			this.invoice = {}
			this.invoiceWorks = []
			this.indications = []
			this.instances = []
			this.invoiceId = -1
			this.forPrinter = true
		}
	},
	created() {
		this.invoiceService = new InvoiceService()
		this.workService = new WorkService()
		this.workIndicationService = new WorkIndicationService()
		this.dentistService = new DentistService()
		this.loadData()
		this.cssText = fs.readFileSync(path.resolve(__static, 'printed.css'), 'UTF-8')
		this.cssText += fs.readFileSync(path.resolve(__static, 'bootstrap.min.css'), 'UTF-8')
	},
	mounted() {}
}
</script>

<style>
@import url('~@/assets/css/printed.css');
@import url('~@/assets/css/bootstrap/css/bootstrap.min.css');
</style>
