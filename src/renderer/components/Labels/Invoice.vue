<template>
<div class="container printed">
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
        <template v-for="work in invoiceWorks">
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
      <span>Esta entidad se encuentra exenta de I.V.A., en virtud de lo dispuesto en el artículo 20. 1. 5º de la Ley 37/1992 que establece que estarán exenta del Impuesto sobre el Valor Añarido. Inscrito en el Registro Mercantil de Sevilla, Tomo 3951, General, Folio 39, Hoja nº SE-57.763. Inscripción 1ª, C.I.F. B91/365023.</span>
    </footer>
  </div>
</div>
</template>

<script>
import moment from 'moment'
import { Printd } from 'printd'
var path = require('path')
var fs = require('fs')
import { getConfigValues, getInvoice, getWorkIndications } from '../../../main/dal.js'
import _ from 'lodash'

export default {
  name: 'invoice',
  data () {
    return {
      cssText: '',
      imgLoaded: false,
      logo: '',
      vatNumber: '',
      container: null,
      invoice: {},
      invoiceWorks: {},
      indications: [],
      moneyFormatter: new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'EUR'
      })
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
    print (container) {
      this.container = container
      this.container.appendChild(this.$el)
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
        this.container.removeChild(this.$el)
      }
    },
    format(date) {
      return moment(date).format('DD/MM/YYYY')
    },
    loadData: async function() {
      var config = await getConfigValues(['logo', 'vatNumber'])
      this.logo = 'data:image/png;base64,' + _.find(config, ['clave', 'logo']).valor
      this.vatNumber = _.find(config, ['clave', 'vatNumber']).valor
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
  },
}
</script>

<style>
  @import url('~@/assets/css/printed.css');
  @import url('~@/assets/css/bootstrap/css/bootstrap.min.css');
</style>
