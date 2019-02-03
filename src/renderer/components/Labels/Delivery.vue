<template>
<div class="container printed-1">
  <div class="row">
    <div class="col-sm-6">
      <h1 class="text-uppercase">Nota de entrega</h1><br>
    </div>
    <div class="col-sm-6">
      <img @load="logoLoaded" :src="logo">
      <br>
    </div>
  </div> <!-- row -->
  <div class="row">
    <div class="col-sm-6">
      CLINICA - Dr/Dra:
      {{NombreDentista}}<br>
      Paciente:
      {{Paciente}}<br>
    </div>
    <div class="col-sm-6">
      <div class="row">
        <div class="col-sm-6">
          FECHA: {{format(FechaTerminacion)}}
        </div>
        <div class="col-sm-6 text-right">
          Nº ALBARÁN: {{IdTrabajo}}
        </div>
      </div>
      <br>
    </div>
  </div> <!-- row -->

  <div class="row pt-4">
    <div class="col-sm-12">
      <table class="table table-bordered" width="95%" cellspacing="0">
        <tr>
          <th width="68%">
            Descripción
          </th>
          <th class="text-right" width="28%">
            Precio
          </th>
        </tr>
        <tr v-for="indication in Detalles" v-bind:key="indication.IdTrabajoDetalle">
          <td>
            {{indication.Descripcion}}
          </td>
          <td class="text-right">
            {{moneyFormatter.format(indication.Precio)}}
          </td>
        </tr>
      </table>
    </div> <!-- col-sm-12 -->
  </div> <!-- row -->
  <div class="row">
    <div class="col-sm-12 text-right font-weight-bold">
      Total: {{moneyFormatter.format(PrecioFinal)}}
    </div>
  </div> <!-- row -->
</div>
</template>

<script>
import moment from 'moment'
import {Printd} from 'printd'
var path = require('path')
var fs = require('fs')

export default {
  name: 'delivery',
  data () {
    return {
      cssText: '',
      moneyFormatter: new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'EUR'
      }),
      imgLoaded: false,
      container: null
    }
  },
  props: {
    IdTrabajo: {
      type: Number,
      required: true
    },
    NombreDentista: {
      type: String,
      required: true
    },
    Paciente: {
      type: String,
      required: true
    },
    FechaTerminacion: {
      type: Date,
      required: true
    },
    Detalles: {
      type: Array,
      required: true
    },
    PrecioFinal: {
      type: Number,
      required: true
    },
    logo: {
      type: String,
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
    waitLogoAndPrint () {
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
    format(FechaTerminacion) {
      return moment(FechaTerminacion).format('DD/MM/YYYY')
    }
  },
  mounted () {
    this.cssText = fs.readFileSync(path.resolve(__static, 'printed.css'), 'UTF-8')
    this.cssText += fs.readFileSync(path.resolve(__static, 'bootstrap.min.css'), 'UTF-8')

    // Check the required parameters (props)
    if (this.IdTrabajo === undefined || this.IdTrabajo === null)
      throw 'Missing prop IdTrabajo in Conformity.vue'
    if (this.NombreDentista === undefined || this.NombreDentista === null)
      throw 'Missing prop NombreDentista in Conformity.vue'
    if (this.Paciente === undefined || this.Paciente === null)
      throw 'Missing prop Paciente in Conformity.vue'
    if (this.FechaTerminacion === undefined || this.FechaTerminacion === null)
      throw 'Missing prop FechaTerminacion in Conformity.vue'
    if (this.Detalles === undefined || this.Detalles === null)
      throw 'Missing prop NombreDentista in Conformity.vue'
    if (this.PrecioFinal === undefined || this.PrecioFinal === null)
      throw 'Missing prop NombreDentista in Conformity.vue'
  }

}
</script>

<style>
  @import url('~@/assets/css/printed.css');
  @import url('~@/assets/css/bootstrap/css/bootstrap.min.css');
</style>
