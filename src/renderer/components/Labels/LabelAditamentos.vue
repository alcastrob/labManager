<template>
  <div class="box" id="labelAditamentos">
    <p class="labelTitle" :class="labelCss">
      {{labelName}}
      <span class="float-right no-background">
        <span class="labelSubtitle">Trabajo nº </span>
        <span class="labelTitle">{{workData.IdTrabajo}}</span>
      </span>
    </p>
    <div style="padding-top: 0px; position: relative; top: -10px;">
      <table style="width: 350px;">
        <tr>
          <td class="noBorder textSmall" valign="top" style="width: 30%; border: 1px solid red;">Clínica o Dr/a: </td>
          <td class="noBorder textSmall" valign="top" style="width: 70%; border: 1px solid green;">{{workData.NombreDentista}}</td>
        </tr>
        <tr>
          <td class="noBorder pt-2 textSmall" valign="top" style="width: 30%;">Paciente: </td>
          <td class="noBorder pt-2 textSmall" valign="top" style="width: 70%;">{{workData.Paciente}}</td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
import {Printd} from 'printd'
var path = require('path')
var fs = require('fs')

export default {
  name: 'labelAditamentos',
  data () {
    return {
      cssText: '',
      name: 'Aditamentos'
    }
  },
  props: {
    workData: {
      type: Object,
      required: true
    },
    workIndications: {
      type: [Object, Array],
      required: true
    }
  },
  methods: {
    print (label) {
      this.name = label
      this.$forceUpdate()
      const d = new Printd()
      d.print( document.getElementById('labelAditamentos'), this.cssText)
    }
  },
  computed: {
    labelName: function() {
      return this.name
    },
    labelCss: function() {
      return 'background-' + this.name
    }
  },
  mounted () {
    this.cssText = fs.readFileSync(path.resolve(__dirname, '../../assets/css/labelStyle.css'), 'UTF-8')
    // Check the required parameters (props)
    if (this.workData === undefined || this.workData === null)
      throw 'Missing prop workData in PrintedLabel1.vue'
    if (this.workIndications === undefined || this.workIndications === null)
      throw 'Missing prop workindications in PrintedLabel1.vue'
  }
}
</script>
<style>
  @import url('~@/assets/css/labelStyle.css');
</style>
