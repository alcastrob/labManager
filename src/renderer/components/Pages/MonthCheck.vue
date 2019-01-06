<template>
<div class="container-fluid">
  <div class="row">
    <div class="col-md-12">
      <h1>Cierre mensual - {{monthName}} {{year}}</h1>
      <p class="text-justify">Aquí figuran los datos de los trabajos del mes agrupados por dentista. Para generar una factura hay que seleccionar los dentistas a los que deseemos emitirle factura (marcando su cuadro de selección) y pulsar el botón Emitir Factura. Para poder marcar un dentista hay que marcar previamente todos sus trabajos. </p>
    </div>
    <!-- <button ref="sss" data-placement="top">
    Botón</button>
    <b-tooltip :target="() => $refs.sss" placement="right">
      <div class="text-left">
        Tipo: Esquelético <br>
        Color: 2B<br>
        Fecha Entrada: 02/01/2018<br>
        Indicaciones:<br>
        <ul>
          <li>REPETICION DE ESTRUCTURA DE ESQUELETICO (50%) | 57.50€</li>
          <li>ESQUELETICO SUPERIOR DE 4 PIEZAS | 175.00€</li>
          <li>1 ENCAMISADO DE ATTACHE | 31.00€</li>
          <li>COLCACION DE 1 ATTACHE | 25.00€</li>
          <li>1 ENCAMISADO DE ATTACHE (50%) | 6.00€</li>
        </ul>
      </div>
    </b-tooltip> -->
  </div> <!-- row -->
  <div class="row">
    <monthCheckExtendedTable :headers="headers" :searchFields="[]" ref="theTable" urlBase="/works/details/" :year="year" :month="month" masterKey="IdDentista"/>
  </div>
</div>
</template>

<script>
import monthCheckExtendedTable from '../PageElements/tables/monthCheckExtendedTable'
import bTooltip from 'bootstrap-vue'

export default {
  name: 'monthCheck',
  components: {
    monthCheckExtendedTable
  },
  data () {
    return {
      headers: [ {
          title: '',
          dataField: 'estado',
          titleClass: 'text-left small-text column5 align-top',
          rowClass: 'small-text text-right'
        }, {
          title: 'Dentista',
          dataField: 'NombreDentista',
          titleClass: 'text-left small-text column20 align-top',
          rowClass: 'small-text'
        }, {
          title: 'P. Final',
          dataField: 'SumaPrecioFinal',
          titleClass: 'text-right small-text column5 align-top',
          rowClass: 'text-right small-text',
          formatter: 'money'
        }, {
          title: 'P. Metal',
          dataField: 'SumaAditamentos',
          titleClass: 'text-right small-text column5 align-top',
          rowClass: 'text-right small-text',
          formatter: 'money'
        }, {
          title: 'Cerámica',
          dataField: 'SumaCeramica',
          titleClass: 'text-right small-text column5 align-top',
          rowClass: 'text-right small-text',
          formatter: 'money'
        }, {
          title: 'Resina',
          dataField: 'SumaResina',
          titleClass: 'text-right small-text column5 align-top',
          rowClass: 'text-right small-text',
          formatter: 'money'
        }, {
          title: 'Ortodoncia',
          dataField: 'SumaOrtodoncia',
          titleClass: 'text-right small-text column5 align-top',
          rowClass: 'text-right small-text',
          formatter: 'money'
        }, {
          title: 'Esquelético',
          dataField: 'SumaEsqueletico',
          titleClass: 'text-right small-text column5 align-top',
          rowClass: 'text-right small-text',
          formatter: 'money'
        }, {
          title: 'Zirconio',
          dataField: 'SumaZirconio',
          titleClass: 'text-right small-text column5 align-top',
          rowClass: 'text-right small-text',
          formatter: 'money'
        }, {
          title: 'Fija Metal',
          dataField: 'SumaFija',
          titleClass: 'text-right small-text column5 align-top',
          rowClass: 'text-right small-text',
          formatter: 'money'
        }, {
          title: 'Total Metal',
          dataField: 'SumaTotalMetal',
          titleClass: 'text-right small-text column5 align-top',
          rowClass: 'text-right small-text',
          formatter: 'money'
        }, {
          title: '% Dto.',
          dataField: 'percentage',
          titleClass: 'text-right small-text column3 align-top',
          rowClass: 'noMargins'
        }, {
          title: 'Dto.',
          dataField: 'SumaDescuento',
          titleClass: 'text-right small-text column5 align-top',
          rowClass: 'text-right small-text',
          formatter: 'money'
        }, {
          title: 'Total',
          dataField: 'SumaGranTotal',
          titleClass: 'text-right small-text column5 align-top',
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
  },
  mounted () {
  }
}
</script>
<style>
.small-text {
  font-size: .8em;
  padding-left: 3px!important;
  padding-right: 2px!important;
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


