<template>
  <invoicePagesWrapper ref="container" :class="{'visuallyhidden': forPrinter}"></invoicePagesWrapper>
  <!-- <div ref="container" :class="{'visuallyhidden': forPrinter}"></div> -->
</template>

<script>
import Vue from 'vue'
import _ from 'lodash'
import {Printd} from 'printd'
var path = require('path')
var fs = require('fs')
import invoicePage from './invoicePage'
import { getConfigValues, getInvoice, getWorkIndications } from '../../../main/dal.js'
import invoicePagesWrapper from './InvoicePagesWrapper'

const MAX_NUMBER_OF_LINES_PER_PAGE = 35

export default {
  name: 'invoicePrint',
  components: {
    invoicePage,
    invoicePagesWrapper
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
    renderContent: async function (invoiceId) {
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
            this.insertInstance(worksToPrint, indicationsToPrint, currentPage, false)
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
        this.insertInstance(worksToPrint, indicationsToPrint, currentPage, true)
        //currentPage++
      }
    },
    print: async function (invoiceId, toPDF = false) {
      this.forPrinter = true
      await this.renderContent(invoiceId)
      if (toPDF === undefined || toPDF == false){
        this.realPrint()
      } else {
        this.$refs.container.printPDF()
      }
    },
    show: async function(invoiceId){
      this.forPrinter = false
      this.renderContent(invoiceId)
    },
    insertInstance(worksToPrint, indicationsToPrint, currentPage, isLastPage){
      var ComponentClass = Vue.extend(invoicePage)
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
      this.$refs.container.append(instance.$el)
      //this.$refs.container.appendChild(instance.$el)

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
          this.$refs.container.remove(currentInstance.$el)
          //this.$refs.container.removeChild(currentInstance.$el)
        }
      }
    },
    loadData: async function() {
      var config = await getConfigValues(['logo', 'vatNumber', 'invoiceFooter'])
      this.logo = 'data:image/png;base64,' + _.find(config, ['clave', 'logo']).valor
      this.vatNumber = _.find(config, ['clave', 'vatNumber']).valor
      this.footer = _.find(config, ['clave', 'invoiceFooter']).valor
    },
  },
  created () {
    this.loadData()
    this.cssText = fs.readFileSync(path.resolve(__static, 'printed.css'), 'UTF-8')
    this.cssText += fs.readFileSync(path.resolve(__static, 'bootstrap.min.css'), 'UTF-8')
  },
  mounter () {
    const ipc = require('electron').ipcRenderer
    ipc.on('wrote-pdf', (event, path) => {
      debugger
    })
  }
}
</script>

<style>
  @import url('~@/assets/css/printed.css');
  @import url('~@/assets/css/bootstrap/css/bootstrap.min.css');
</style>
