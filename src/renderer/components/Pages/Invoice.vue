<template>
<div class="container">
  <div class="row">
    <div class="col-md-6">
      <h1>Ver Factura</h1>
    </div> <!-- col-md-6 -->
    <div class="col-md-6 mt-2">
      <div class="float-right">
        <collapsable-action-button iconCss="fas fa-print" text="Imprimir factura" :callback="printInvoice"></collapsable-action-button>
      </div>
    </div> <!-- col-md-6 -->
  </div> <!-- row -->
  <div class="row">
    <div class="col-md-12">
      <invoicePrint ref="invoiceShow"></invoicePrint>
      <invoicePrint ref="invoicePrint"></invoicePrint>
    </div> <!-- col-md-12 -->
  </div> <!-- row -->
</div>
</template>

<script>
import _ from 'lodash'
import invoicePrint from '../Labels/InvoicePrint'
import collapsableActionButton from '../PageElements/CollapsableButtons/collapsableActionButton'

export default {
  name: 'invoice',
  components: {
    collapsableActionButton,
    invoicePrint
  },
  data () {
    return { }
  },
  methods: {
    printInvoice: async function() {
      this.$refs.invoicePrint.print(this.$route.params.id)
    }
  },
  mounted () {
    this.$refs.invoiceShow.show(this.$route.params.id)
  }
}
</script>

<style>
</style>
