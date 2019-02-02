<template>
  <div ref="container" :class="{'visuallyhidden': forPrinter}"></div>
</template>

<script>
import Vue from 'vue'
import _ from 'lodash'
import {Printd} from 'printd'
var path = require('path')
var fs = require('fs')
import invoicePage from './invoicePage'
import reportPage from './reportPage'
import { getConfigValues, getInvoice, getWorkIndications, getDentist } from '../../../main/dal.js'

const MAX_NUMBER_OF_LINES_PER_PAGE = 35

export default {
  name: 'invoicePrint',
  components: {
    invoicePage,
    reportPage
  },
  data () {
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
      forPrinter: true
    }
  },
  methods: {
    loadInvoiceData: async function(invoiceId){
      if (invoiceId === undefined || invoiceId === null){
        throw 'Missing required parameter invoiceId on call to print method of InvoicePrint.vue'
      }

      this.invoiceId = invoiceId
      var x = await getInvoice(this.invoiceId)
      this.invoice = x.invoice
      this.invoiceWorks = x.invoiceWorks

      for (var work of this.invoiceWorks){
        this.indications[work.IdTrabajo] = await getWorkIndications(work.IdTrabajo)
      }
    },
    renderContent: function (isInvoice) {
      if (this.invoice === {}){
        this.loadInvoiceData()
      }
      this.pageLogosLoaded = {}

      this.instances = []
      var currentPageLines = 0
      var currentPage = 1

      var worksToPrint = []
      var indicationsToPrint = []

      for (var currentWork of this.invoiceWorks){
        if (this.forPrinter){
          var toAdd = 2 + this.indications[currentWork.IdTrabajo].length
          if (currentPageLines + toAdd <= MAX_NUMBER_OF_LINES_PER_PAGE) {
            worksToPrint.push(currentWork)
            indicationsToPrint[currentWork.IdTrabajo]=this.indications[currentWork.IdTrabajo]
            currentPageLines += toAdd
          }
          else {
            this.insertInstance(worksToPrint, indicationsToPrint, currentPage, false, isInvoice)
            // Now we reset the arrays and include the current work in the next page
            currentPage++
            worksToPrint = [currentWork]
            indicationsToPrint = []
            indicationsToPrint[currentWork.IdTrabajo] = this.indications[currentWork.IdTrabajo]
            currentPageLines = 2 + this.indications[currentWork.IdTrabajo].length
          }
        } else {
          worksToPrint.push(currentWork)
          indicationsToPrint[currentWork.IdTrabajo]=this.indications[currentWork.IdTrabajo]
        }
      }

      if (indicationsToPrint.length !== 0){
        //We have something to print on the last page
        this.insertInstance(worksToPrint, indicationsToPrint, currentPage, true, isInvoice)
      }
    },
    print: async function (invoiceId) {
      this.dataReset()
      this.forPrinter = true
      await this.loadInvoiceData(invoiceId)
      this.renderContent(true)
      this.realPrint()
    },
    printNoInvoice: async function(invoiceData) {
      this.dataReset()
      this.forPrinter = true

      this.invoice = await getDentist(invoiceData.IdDentista)
      this.invoice.Total = 0
      this.invoiceWorks = invoiceData.selectedWorks
      for (var work of this.invoiceWorks){
        this.indications[work.IdTrabajo] = await getWorkIndications(work.IdTrabajo)
        work.PrecioSinDescuento = work.SumaPrecioFinal
        work.PrecioFinalConDescuento = work.SumaPrecioFinal - work.TotalDescuento
        this.invoice.Total += work.PrecioFinalConDescuento
      }

      this.renderContent(false)
      this.realPrint()

    },
    show: async function(invoiceId){
      this.dataReset()
      this.forPrinter = false
      await this.loadInvoiceData(invoiceId)
      this.renderContent(true)
    },
    insertInstance(worksToPrint, indicationsToPrint, currentPage, isLastPage, isInvoice){
      debugger
      var ComponentClass
      if (isInvoice){
        ComponentClass = Vue.extend(invoicePage)
      } else {
        ComponentClass = Vue.extend(reportPage)
      }
      this.pageLogosLoaded[currentPage] = false
      var instance = new ComponentClass({
        propsData: {
          invoice: this.invoice,
          //The array must be cloned for this specific page
          works: worksToPrint.slice(0),
          indications: indicationsToPrint.slice(0),
          isFirstPage: currentPage === 1,
          isLastPage: isLastPage,
          pageNumber: currentPage,
          cssText: this.cssText,
          logo: this.logo,
          vatNumber: this.vatNumber,
          footer: this.footer,
          forPrinter: this.forPrinter
        }
      })
      this.instances.push(instance)
      instance.$mount()
      instance.waitLogo(this.waitLogoCallback)
      this.$refs.container.appendChild(instance.$el)

    },
    waitLogoCallback(pageNumber) {
      this.pageLogosLoaded[pageNumber] = true
    },
    realPrint() {
      //This method is intended to be used only when all the logos of the invoicePage components are fully loaded
      if (! _.every(Object.values(this.pageLogosLoaded), (val) => {return val})) {
        window.setTimeout(this.realPrint, 500)
        return
      } else {
        const d = new Printd()
        d.print(this.$el, this.cssText)

        for (var currentInstance of this.instances) {
          this.$refs.container.removeChild(currentInstance.$el)
        }
      }
    },
    loadData: async function() {
      var config = await getConfigValues(['logo', 'vatNumber', 'invoiceFooter'])
      this.logo = 'data:image/png;base64,' + _.find(config, ['clave', 'logo']).valor
      this.vatNumber = _.find(config, ['clave', 'vatNumber']).valor
      this.footer = _.find(config, ['clave', 'invoiceFooter']).valor
    },
    dataReset: function() {
      this.invoice = {}
      this.invoiceWorks = []
      this.indications = []
      this.instances = [],
      this.invoiceId = -1,
      this.forPrinter = true
    }
  },
  created () {
    this.loadData()
    this.cssText = fs.readFileSync(path.resolve(__static, 'printed.css'), 'UTF-8')
    this.cssText += fs.readFileSync(path.resolve(__static, 'bootstrap.min.css'), 'UTF-8')
  },
  mounted () {
  }
}
</script>

<style>
  @import url('~@/assets/css/printed.css');
  @import url('~@/assets/css/bootstrap/css/bootstrap.min.css');
</style>
