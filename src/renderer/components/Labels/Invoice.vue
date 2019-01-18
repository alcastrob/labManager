<template>
  <div ref="container" class="visuallyhidden"></div>
</template>

<script>
import Vue from 'vue'
import _ from 'lodash'
import {Printd} from 'printd'
var path = require('path')
var fs = require('fs')
import invoicePage from './invoicePage'
import { getConfigValues, getInvoice, getWorkIndications } from '../../../main/dal.js'

const MAX_NUMBER_OF_LINES_PER_PAGE = 35

export default {
  name: 'invoice',
  components: {
    invoicePage
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
      invoiceId: -1
    }
  },
  methods: {
    print: async function (invoiceId, toPDF) {
      if (invoiceId === undefined || invoiceId === null){
        throw 'Missing required parameter invoiceId on call to print method of Invoice.vue'
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
      }

      if (indicationsToPrint.length !== 0){
        //We have something to print on the last page
        this.insertInstance(worksToPrint, indicationsToPrint, currentPage, true)
        currentPage++
      }
      if (toPDF === undefined || toPDF == false){
        this.realPrint()
      } else {
        const ipc = require('electron').ipcRenderer
        ipc.send('print-to-pdf')
      }
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
          footer: this.footer
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
    printPdf(){
      const ipc = require('electron').ipcRenderer
      ipc.send('print-to-pdf')
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
  }
}
</script>

<style>
.visuallyhidden:not(:focus):not(:active) {
  position: absolute;

  width: 1px;
  height: 1px;
  margin: -1px;
  border: 0;
  padding: 0;

  white-space: nowrap;

  clip-path: inset(100%);
  clip: rect(0 0 0 0);
  overflow: hidden;
}
</style>
