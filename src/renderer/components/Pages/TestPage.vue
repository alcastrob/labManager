<template>
  <div>
    <button @click="insert">Insert</button>
    {{idInvoice}}
    <button @click="get">Get</button>
    {{invoice}}
    <button @click="getList">Get List</button>
    {{list}}
    <button @click="print">Print</button>

    <invoice :invoiceId="595" ref="invoice"></invoice>
    <!-- class="invisible" -->
  </div>
</template>

<script>
import Vue from 'vue'
import _ from 'lodash'
import {Printd} from 'printd'
import invoice from '../Labels/Invoice'
import {insertInvoice, getInvoice, getInvoicesList, getConfigValues} from '../../../main/dal.js'

export default {
  name: 'testPage',
  components: {
    invoice
  },
  data () {
    return {
      idInvoice: '',
      invoice: {},
      list: [],
    }
  },
  methods: {
    insert: async function() {
      var idDentista = 113
      var idTrabajo1 = 400
      var esDescuento1 = false
      var idTrabajo2 = 498
      var esDescuento2 = false

      // this.idInvoice = await insertInvoice(idDentista, [
      //   {idTrabajo: idTrabajo1, esDescuento: esDescuento1},
      //   {idTrabajo: idTrabajo2, esDescuento: esDescuento2}
      // ])
      this.idInvoice = await insertInvoice(46, [
        {idTrabajo: 288, esDescuento: false},
        {idTrabajo: 313, esDescuento: false},
        {idTrabajo: 394, esDescuento: false},
        {idTrabajo: 419, esDescuento: false},
        {idTrabajo: 509, esDescuento: false},
        {idTrabajo: 565, esDescuento: false},
        {idTrabajo: 600, esDescuento: false},
        {idTrabajo: 657, esDescuento: false},
        {idTrabajo: 665, esDescuento: false},
        {idTrabajo: 666, esDescuento: false},
        {idTrabajo: 735, esDescuento: false},
        {idTrabajo: 736, esDescuento: false}
      ])
    },
    get: async function() {
      this.invoice = await getInvoice(this.idInvoice)
    },
    getList: async function() {
      this.list = await getInvoicesList (
        {
          year: 2018,
          month: 2,
          dentistId: 46
        }
      )
    },
    print: function() {
      this.$refs.invoice.print()
    }
  }
}
</script>

<style>
</style>
