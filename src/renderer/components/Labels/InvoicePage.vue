<template>
<div class="container printed pagebreak">
  <div class="row">
    <div class="col-sm-6">
      <img @load="logoLoaded" :src="logo" class="mt-3">
      <br>
      CIF: {{vatNumber}}
    </div> <!-- col-sm-6 -->
    <div class="col-sm-6">
      <h1 class="text-uppercase text-right">Factura</h1>
    </div> <!-- col-sm-6 -->
  </div> <!-- row -->
  <div class="row mt-2">
    <div class="col-sm-6">
      <h3 class="text-uppercase">Datos de la factura</h3>
      <h5>Número: {{invoice.NumFactura}} |  Fecha: {{format(invoice.Fecha)}}</h5>
    </div> <!-- col-sm-6 -->
    <div class="col-sm-6">
      <div class="clientBox">
        <h3 class="text-uppercase">Cliente</h3>
        {{invoice.NombreDentista}}<br>
        {{invoice.NombreClinica}}<br>
        {{invoice.DatosFiscales}}<br>
        {{invoice.Direccion}}<br>
        {{invoice.CP}} {{invoice.Poblacion}}
      </div>
    </div> <!-- col-sm-6 -->
  </div> <!-- row -->
  <div class="row mt-5">
    <table class="table table-invoice" width="100%" cellspacing="0">
      <thead>
        <tr>
          <th class="text-left" style="width: 60%;">Concepto</th>
          <th class="text-right" style="width: 10%;">Cantidad</th>
          <th class="text-right" style="width: 10%;">Dto.</th>
          <th class="text-right" style="width: 10%;">P. Unidad</th>
          <th class="text-right" style="width: 10%;">Subtotal</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="work in works">
          <tr v-bind:key="work.IdTrabajo" class="pagebreak">
            <td class="text-left">
              <span class="font-weight-bold">Nº Trabajo: {{work.IdTrabajo}}. Fecha: {{format(work.FechaEntrada)}}</span><br>
              <span class="">{{work.Paciente}}</span>
            </td>
            <td class="text-right">1</td>
            <td class="text-right">-</td>
            <td class="text-right">{{moneyFormatter.format(work.PrecioFinal)}}</td>
            <td class="text-right">{{moneyFormatter.format(work.PrecioFinal)}}</td>
          </tr>
          <tr class="leapTr dontBreakHere" v-for="indication in indications[work.IdTrabajo]" v-bind:key="indication.IdTrabajoDetalle">
            <td class="text-left">
              <span class="text-monospace">{{indication.Descripcion}}</span>
            </td>
            <td class="text-right"></td>
            <td class="text-right"></td>
            <td class="text-right"></td>
            <td class="text-right"></td>
          </tr>
          <tr class="leapTr dontBreakHere" v-for="indication in indications[work.IdTrabajo]" v-bind:key="indication.IdTrabajoDetalle + 'b'">
            <td class="text-left">
              <span class="text-monospace">{{indication.Descripcion}}</span>
            </td>
            <td class="text-right"></td>
            <td class="text-right"></td>
            <td class="text-right"></td>
            <td class="text-right"></td>
          </tr>
        </template>
      </tbody>
    </table>
    <footer>
      <div class="text-right printed-1 pb-2">Página {{pageNumber}}</div>
      <span>{{footer}}</span>
    </footer>
  </div>
</div>
</template>

<script>
import _ from 'lodash'
import moment from 'moment'
import { Printd } from 'printd'
var path = require('path')
var fs = require('fs')
import { getConfigValues, getInvoice, getWorkIndications } from '../../../main/dal.js'

export default {
  name: 'invoicePage',
  data () {
    return {
      cssText: '',
      imgLoaded: false,
      logo: '',
      vatNumber: '',
      footer: '',
      parentContainer: null,
      moneyFormatter: new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'EUR'
      })
    }
  },
  props: {
    invoice: {
      type: Object,
      required: true
    },
    works: {
      type: Array,
      required: true
    },
    indications: {
      type: Array,
      required: true
    },
    pageNumber: {
      type: Number,
      required: true
    }
  },
  methods: {
    logoLoaded() {
      this.imgLoaded = true
    },
    print (container) {
      this.parentContainer = container
      this.parentContainer.appendChild(this.$el)
      this.waitLogoAndPrint()
    },
    waitLogoAndPrint(){
      if (!this.imgLoaded) {
        window.setTimeout(this.waitLogoAndPrint, 1000)
        return
      } else {
        this.$forceUpdate()

        const d = new Printd()
        d.print(this.$el, this.cssText)
        //this.parentContainer.removeChild(this.$el)
      }
    },
    format(date) {
      return moment(date).format('DD/MM/YYYY')
    },
    loadData: async function() {
      var config = await getConfigValues(['logo', 'vatNumber', 'invoiceFooter'])
      this.logo = 'data:image/png;base64,' + _.find(config, ['clave', 'logo']).valor
      this.vatNumber = _.find(config, ['clave', 'vatNumber']).valor
      this.footer = _.find(config, ['clave', 'invoiceFooter']).valor
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
  @import url('~@/assets/css/printed.css');
  @import url('~@/assets/css/bootstrap/css/bootstrap.min.css');
</style>
