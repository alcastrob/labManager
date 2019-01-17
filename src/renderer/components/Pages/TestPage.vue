<template>
  <div>
    <button @click="insert">Insert</button>
    {{idInvoice}}
    <button @click="get">Get</button>
    {{invoice}}
    <button @click="getList">Get</button>
    {{list}}
  </div>
</template>

<script>
import {insertInvoice, getInvoice, getInvoicesList} from '../../../main/dal.js'

export default {
  name: 'testPage',
  data () {
    return {
      idInvoice: '',
      invoice: {},
      list: []
    }
  },
  methods: {
    insert: async function() {
      var idDentista = 113
      var idTrabajo1 = 400
      var esDescuento1 = false
      var idTrabajo2 = 498
      var esDescuento2 = false

      this.idInvoice = await insertInvoice(idDentista, [
        {idTrabajo: idTrabajo1, esDescuento: esDescuento1},
        {idTrabajo: idTrabajo2, esDescuento: esDescuento2}
      ])
    },
    get: async function() {
      this.invoice = await getInvoice(this.idInvoice)
    },
    getList: async function() {
      this.list = await getInvoicesList (
        {
          year: 2018,
          month: 1,
          dentistId: 49
        }
      )
    }
  }
}
</script>

<style>
</style>
