<template>
<div class="container-fluid">
  <div class="row">
    <div class="col-md-6">
      <h1>Cierre mensual - {{monthName}} {{year}}</h1>
    </div> <!-- col-md-8 -->
    <div class="col-md-6 mt-2">
      <div class="float-right">
        <button class="btn btn-warning" :disabled="selectedDentists.length === 0" @click="generateInvoice()"><i class="fas fa-file-invoice-dollar mr-2"></i>Generar Resumen Mensual</button>
        <button class="btn btn-warning" :disabled="selectedDentists.length === 0" @click="generateInvoice()"><i class="fas fa-file-invoice-dollar mr-2"></i>Generar facturas</button>
      </div>
    </div> <!-- col-md-4 -->
  </div> <!-- row -->
  <div class="row">
    <div class="col-md-12">
      <p class="text-justify">Aquí figuran los datos de los trabajos del mes agrupados por dentista. Para generar una factura hay que seleccionar los dentistas a los que deseemos emitirle factura (marcando su cuadro de selección) y pulsar el botón Generar facturas. Para poder marcar un dentista hay que marcar previamente todos sus trabajos. </p>
      <!-- {{selectedDentists}} -->
    </div> <!-- col-md-12 -->
  </div> <!-- row -->
  <div class="row">
    <monthCheckExtendedTable :headers="headers" :searchFields="[]" ref="theTable" urlBase="/works/details/" :year="year" :month="month" masterKey="IdDentista" v-model="selectedDentists" />
  </div> <!-- row -->
  <b-modal ref="modal" size="lg" title="Emisión de facturas" hide-footer>
    <div class="modal-body">
      <div class="containter">
        <div class="row">
          <div class="col-md-12">
            <span>
              Se van a emitir facturas para los siguientes clientes. Por favor, verifique que los datos de los posibles descuentos aplicados son correctos. Una vez emitidas las facturas, se podrán consultar y volver a imprimir desde la sección Facturas del área de Gestión Económica.
            </span>
            <ul class="pt-3">
              <li v-for="dentist in selectedDentists" v-bind:key="dentist.IdDentista">{{dentist.NombreDentista}} | Importe base: {{moneyFormatter.format(dentist.ImporteBase)}} | Dto. {{dentist.Dto}}% ({{moneyFormatter.format(dentist.ImporteDto)}}) | Total factura: {{moneyFormatter.format(dentist.Total)}}</li>
            </ul>
          </div> <!-- col-md-12 -->
        </div> <!-- row -->
        <div class="row">
          <div class="col-md-6">
            <label for="fechaFacturas">Establezca la fecha de las facturas a emitir:</label>
            <input type="date" class="form-control" id="fechaFacturas" placeholder="dd/mm/aaaa" v-model="invoiceDate">
            <a href="#" class="form-text text-muted ml-2" v-on:click="setStartDateToToday()">
              <i class="far fa-calendar-alt"></i>
              Poner fecha de hoy
            </a>
          </div> <!-- col-md-6 -->
        </div> <!-- row -->
        <div class="row" v-if="inProgress">
          <div class="col-md-12 pt-5 pb-3">
            <div class="progress">
              <div class="progress-bar bg-info" style="width:33%">33%</div>
            </div>
          </div> <!-- col-md-12 -->
        </div> <!-- row -->
      </div> <!-- containter -->
    </div> <!-- modal-body -->
    <div class="modal-footer">
      <button class="btn btn-secondary" @click="hideModal"><i class="fas fa-times-circle mr-2 position-relative" style="top: 1px;"></i>Cancelar</button>
      <button class="btn btn-secondary " @click="confirmGeneration" ref="btnPrint" :disabled="invoiceDate === ''"><i class="fas fa-file-invoice-dollar mr-2"></i>Generar facturas</button>
      <button class="btn btn-secondary " @click="confirmGeneration" ref="btnPrint" :disabled="invoiceDate === ''"><i class="fas fa-print mr-2"></i>Generar e imprimir facturas</button>
    </div>
  </b-modal>
</div>
</template>

<script>
import monthCheckExtendedTable from '../PageElements/tables/monthCheckExtendedTable'
import { bTooltip, bModal} from 'bootstrap-vue'

export default {
  name: 'monthCheck',
  components: {
    monthCheckExtendedTable,
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
      month: 0,
      selectedDentists: [],
      invoiceDate: '',
      inProgress: false,
      moneyFormatter : new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'EUR'
      })
    }
  },
  methods: {
    generateInvoice() {
      this.showModal()
    },
    confirmGeneration() {
      this.inProgress = true
    },
    showModal() {
      this.$refs.modal.show()
    },
    hideModal() {
      this.$refs.modal.hide()
    },
    setStartDateToToday: function() {
      var today = new Date()
      var dd = today.getDate()

      var mm = today.getMonth()+1
      var yyyy = today.getFullYear()
      if(dd<10) {
          dd='0'+dd;
      }

      if(mm<10) {
          mm='0'+mm;
      }

      this.invoiceDate = yyyy + '-' + mm + '-' + dd
    },
  },
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

</style>


