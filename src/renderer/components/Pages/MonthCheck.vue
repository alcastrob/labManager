<template>
<div class="container-fluid">
  <div class="row">
    <div class="col-md-6">
      <h1>Cierre mensual - {{monthName}} {{year}}</h1>
    </div>
  </div> <!-- row -->
  <div class="row">
    <monthCheckExtendedTable :headers="headers" :searchFields="[]" ref="theTable" urlBase="/works/details/" masterKey="IdDentista"/>
  </div>
</div>
</template>

<script>
import { getWorksAggregatedByDentist } from '../../../main/dal.js'
import monthCheckExtendedTable from '../PageElements/tables/monthCheckExtendedTable'


export default {
  name: 'monthCheck',
  components: {
    monthCheckExtendedTable
  },
  data () {
    return {
      headers: [ {
          title: '',
          dataField: 'IdDentista',
          titleClass: 'invisible',
          rowClass: 'invisible'
        }, {
          title: 'Estado',
          dataField: 'estado',
          titleClass: 'text-left small-text',
          rowClass: ''
        }, {
          title: 'Dentista',
          dataField: 'NombreDentista',
          titleClass: 'text-left small-text',
          rowClass: 'small-text'
        }, {
          title: 'Precio Final',
          dataField: 'SumaPrecioFinal',
          titleClass: 'text-right mr-2 small-text',
          rowClass: 'text-right small-text',
          formatter: 'money'
        }, {
          title: 'Aditamentos',
          dataField: 'SumaAditamentos',
          titleClass: 'text-right mr-2 small-text',
          rowClass: 'text-right small-text',
          formatter: 'money'
        }, {
          title: 'Cerámica',
          dataField: 'SumaCeramica',
          titleClass: 'text-right mr-2 small-text',
          rowClass: 'text-right small-text',
          formatter: 'money'
        }, {
          title: 'Resina',
          dataField: 'SumaResina',
          titleClass: 'text-right mr-2 small-text',
          rowClass: 'text-right small-text',
          formatter: 'money'
        }, {
          title: 'Ortodoncia',
          dataField: 'SumaOrtodoncia',
          titleClass: 'text-right mr-2 small-text',
          rowClass: 'text-right small-text',
          formatter: 'money'
        }, {
          title: 'Esquelético',
          dataField: 'SumaEsqueletico',
          titleClass: 'text-right mr-2 small-text',
          rowClass: 'text-right small-text',
          formatter: 'money'
        }, {
          title: 'Zirconio',
          dataField: 'SumaZirconio',
          titleClass: 'text-right mr-2 small-text',
          rowClass: 'text-right small-text',
          formatter: 'money'
        }, {
          title: 'Fija',
          dataField: 'SumaFija',
          titleClass: 'text-right mr-2 small-text',
          rowClass: 'text-right small-text',
          formatter: 'money'
        }, {
          title: 'Total Metal',
          dataField: 'SumaTotalMetal',
          titleClass: 'text-right mr-2 small-text',
          rowClass: 'text-right small-text',
          formatter: 'money'
        }, {
          title: '% Dto.',
          dataField: 'percentage',
          titleClass: 'text-right mr-2 small-text',
          rowClass: 'text-right small-text'
        }, {
          title: 'Dto.',
          dataField: 'discount',
          titleClass: 'text-right mr-2 small-text',
          rowClass: 'text-right small-text',
          formatter: 'money'
        }, {
          title: 'Total',
          dataField: 'grandtotal',
          titleClass: 'text-right mr-2 small-text',
          rowClass: 'text-right small-text',
          formatter: 'money'
        },
      ],
      rows: [],
      year: 0,
      month: 0
    }
  },
  methods: {},
  computed: {
    monthName: function() {
      var objDate = new Date()
      objDate.setMonth(this.month - 1)
      return objDate.toLocaleString("es-es", {month: 'long'})
    }
  },
  mounted () {
    debugger
    this.year = this.$route.params.year
    this.month = this.$route.params.month
    getWorksAggregatedByDentist(this.year, this.month, 'labManager.sqlite').then((workDetails) => {
      this.rows = workDetails
      this.$refs.theTable.setDataset(this.rows)
    })
  }
}
</script>
<style>
.small-text {
  font-size: .8em;
}
</style>


