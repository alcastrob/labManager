<template>
  <div ref="container"></div>
</template>

<script>
import Vue from 'vue'
import _ from 'lodash'
import {Printd} from 'printd'
var path = require('path')
var fs = require('fs')
import invoicePage from './invoicePage'
import { getInvoice, getWorkIndications } from '../../../main/dal.js'

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
      cssText: ''
    }
  },
  props: {
    invoiceId: {
      type: Number,
      required: true
    }
  },
  methods: {
    logoLoaded() {
      this.imgLoaded = true
    },
    print (parentContainer) {
      var ComponentClass = Vue.extend(invoicePage)
      var instance = new ComponentClass({
        propsData: {
          invoice: this.invoice,
          works: this.invoiceWorks,
          indications: this.indications,
          pageNumber: 1
        }
      })
      var instance2 = new ComponentClass({
        propsData: {
          invoice: this.invoice,
          works: this.invoiceWorks,
          indications: this.indications,
          pageNumber: 2
        }
      })

      instance.$mount()
      instance2.$mount()
      this.$refs.container.appendChild(instance.$el)
      this.$refs.container.appendChild(instance2.$el)
      const d = new Printd()
      d.print(this.$el, this.cssText)
    },
    loadData: async function() {
      var x = await getInvoice(this.invoiceId)
      this.invoice = x.invoice
      this.invoiceWorks = x.invoiceWorks
      for (var work of this.invoiceWorks){
        this.indications[work.IdTrabajo] = await getWorkIndications(work.IdTrabajo)
      }
    }
  },
  created () {
    this.loadData()
    this.cssText = fs.readFileSync(path.resolve(__static, 'printed.css'), 'UTF-8')
    this.cssText += fs.readFileSync(path.resolve(__static, 'bootstrap.min.css'), 'UTF-8')
  }
}
</script>

<style>
</style>
