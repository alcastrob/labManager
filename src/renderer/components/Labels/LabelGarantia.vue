<template>
  <div class="box">
    <table class="noborder">
      <tr>
        <td colspan="2" class="noborder">
          <img @load="logoLoaded" :src="logo" width="350px">
        </td>
      </tr>
      <tr>
        <td class="labelSubtitle noborder">
          Trabajo nº
        </td>
        <td class="labelTitle noborder">
          {{workData.IdTrabajo}}
        </td>
      </tr>
      <tr>
        <td class="labelSubtitle noborder">
          Paciente:
        </td>
        <td class="labelTitle noborder">
          {{workData.Paciente}}
        </td>
      </tr>
      <tr>
        <td class="labelSubtitle noborder">
          Clínica o Dr/a.:
        </td>
        <td class="labelTitle noborder">
          {{workData.NombreDentista}}
        </td>
      </tr>
      <tr>
        <td colspan="2" class="labelSubtitle noborder">
          <br>
          Este trabajo se garantiza durante {{period}} meses contra malformación o rotura por uso normal en boca.
          <br>
          <br>
          <br>
        </td>
      </tr>
      <tr>
        <td class="labelSubtitle noborder">
          Fecha:<br> {{format(workData.FechaTerminacion)}}
        </td>
        <td class="labelSubtitle text-vtop noborder text-right" style="vertical-align: text-top; text-align: right;">
          Sello de clínica
        </td>
      </tr>
    </table>
  </div> <!-- box -->
</template>

<script>
import labelMixin from './LabelMixin'
import moment from 'moment'
var path = require('path')
var fs = require('fs')
import {Printd} from 'printd'

export default {
  name: 'labelGarantia',
  mixins: [labelMixin],
  data () {
    return {
      imgLoaded: false,
      parentCallback: undefined
    }
  },
  props: {
    logo: {
      type: String,
      required: true
    },
    workData: {
      type: Object,
      required: true
    },
    period: {
      type: Number,
      required: true
    }
  },
  methods: {
    logoLoaded() {
      this.imgLoaded = true
    },
    waitLogoAndPrint(){
      if (!this.imgLoaded) {
        window.setTimeout(this.waitLogo, 500)
        return
      } else {
        this.print()
      }
    },
    print () {
      const d = new Printd()
      d.print(this.$el, this.cssText)
    },
    format(date) {
      return moment(date).format('DD/MM/YYYY')
    }
  }
}
</script>
