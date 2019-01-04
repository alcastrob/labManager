<template>
<div class="container-fluid">
  <div class="row">
    <div class="col-md-6">
      <h1>Cierre mensual - {{monthName}} {{year}}</h1>
    </div>
  </div> <!-- row -->
  <div class="row">
    <monthCheckExtendedTable :headers="headers" :searchFields="[]" ref="theTable" urlBase="/works/details/" :year="year" :month="month" masterKey="IdDentista"/>
  </div>
</div>
</template>

<script>
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
          title: '',
          dataField: 'estado',
          titleClass: 'text-left small-text column3',
          rowClass: ''
        }, {
          title: 'Dentista',
          dataField: 'NombreDentista',
          titleClass: 'text-left small-text column20',
          rowClass: 'small-text column20'
        }, {
          title: 'Precio Final',
          dataField: 'SumaPrecioFinal',
          titleClass: 'text-right small-text column7',
          rowClass: 'text-right small-text',
          formatter: 'money'
        }, {
          title: 'Precio Metal',
          dataField: 'SumaAditamentos',
          titleClass: 'text-right small-text column7',
          rowClass: 'text-right small-text',
          formatter: 'money'
        }, {
          title: 'Cerámica',
          dataField: 'SumaCeramica',
          titleClass: 'text-right small-text column7',
          rowClass: 'text-right small-text',
          formatter: 'money'
        }, {
          title: 'Resina',
          dataField: 'SumaResina',
          titleClass: 'text-right small-text column7',
          rowClass: 'text-right small-text',
          formatter: 'money'
        }, {
          title: 'Ortodoncia',
          dataField: 'SumaOrtodoncia',
          titleClass: 'text-right small-text column7',
          rowClass: 'text-right small-text',
          formatter: 'money'
        }, {
          title: 'Esquelético',
          dataField: 'SumaEsqueletico',
          titleClass: 'text-right small-text column7',
          rowClass: 'text-right small-text',
          formatter: 'money'
        }, {
          title: 'Zirconio',
          dataField: 'SumaZirconio',
          titleClass: 'text-right small-text column7',
          rowClass: 'text-right small-text',
          formatter: 'money'
        }, {
          title: 'Fija Metal',
          dataField: 'SumaFija',
          titleClass: 'text-right small-text column7',
          rowClass: 'text-right small-text',
          formatter: 'money'
        }, {
          title: 'Total Metal',
          dataField: 'SumaTotalMetal',
          titleClass: 'text-right small-text column7',
          rowClass: 'text-right small-text',
          formatter: 'money'
        }, {
          title: '% Dto.',
          dataField: 'percentage',
          titleClass: 'text-right small-text column5',
          rowClass: 'text-right small-text'
        }, {
          title: 'Dto.',
          dataField: 'discount',
          titleClass: 'text-right small-text column7',
          rowClass: 'text-right small-text',
          formatter: 'money'
        }, {
          title: 'Total',
          dataField: 'grandtotal',
          titleClass: 'text-right small-text column7',
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
  created () {
    this.year = this.$route.params.year
    this.month = this.$route.params.month
  }
}
</script>
<style>
.small-text {
  font-size: .8em;
  padding-left: 3px!important;
  padding-right: 0px!important;
  padding-top: 5px!important;
  padding-bottom: 5px!important;
}

.dentist-text {
  font-size: .8em;
  font-style: italic;
  padding-left: 15px!important;
  padding-right: 3px!important;
  padding-top: 5px!important;
  padding-bottom: 5px!important;
}

.very-small-text {
  font-size: .8em;
  /* font-style: italic; */
  padding-left: 0px!important;
  padding-right: 3px!important;
  padding-top: 5px!important;
  padding-bottom: 5px!important;
}

.column20 {
  width: 20%;
}

.column7 {
  width: 7%;
}

.column5 {
  width: 5%;
}
.column3 {
  width: 3%;
}

</style>


