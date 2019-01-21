<template>
  <div>
    <invoiceExtendedTable :headers="headers" :searchFields="searchFields" ref="table" urlBase="/finances/invoices/" masterKey="IdFactura">
    </invoiceExtendedTable>
  </div>
</template>

<script>
import { getInvoicesList } from '../../../main/dal.js'
import invoiceExtendedTable from '../PageElements/tables/invoiceExtendedTable'
export default {
  name: 'test',
  components: {
    invoiceExtendedTable
  },
  data () {
    return {
      headers: [ {
          title: 'Nº Factura',
          dataField: 'NumFactura',
          titleClass: 'text-left',
          rowClass: ''
        }, {
          title: 'Dentista',
          dataField: 'NombreDentista',
          titleClass: 'text-left',
          rowClass: ''
        }, {
          title: 'Dirección',
          dataField: 'Direccion',
          titleClass: 'text-left',
          rowClass: ''
        }, {
          title: 'Población',
          dataField: 'Poblacion',
          titleClass: 'text-left',
          rowClass: ''
        }, {
          title: 'CP',
          dataField: 'CP',
          titleClass: 'text-left',
          rowClass: ''
        }, {
          title: 'Fecha Factura',
          dataField: 'Fecha',
          titleClass: 'text-left',
          rowClass: '',
          formatter: 'date'
        }, {
          title: 'Total',
          dataField: 'Total',
          titleClass: 'text-left',
          rowClass: '',
          formatter: 'money'
        } ],
      searchFields: ['NumFactura', 'NombreDentista', 'Direccion', 'Pablacion', 'CP']
    }
  },
  methods: {
    updateDatasetWithFilters: async function (eventData) {
      this.$refs.table.setDataset(await getInvoicesList(eventData))
    },
  },
  mounted () {
    this.updateDatasetWithFilters()
  }
}
</script>

<style>
</style>
