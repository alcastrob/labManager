<template>
  <div class="box" id="labelAditamentos">
    <p class="labelTitle background">
      {{labelName}}
      <span class="float-right no-background">
        <span class="labelSubtitle">Trabajo nº </span>
        <span class="labelTitle">{{workData.IdTrabajo}}</span>
      </span>
    </p>
    <div style="padding-top: 0px;">
      <table>
        <tr>
          <td class="noBorder" valign="top">Clínica o Dr/a: </td>
          <td class="noBorder" valign="top">{{workData.NombreDentista}}</td>
        </tr>
        <tr>
          <td class="noBorder pt-2" valign="top">Paciente: </td>
          <td class="noBorder pt-2" valign="top">{{workData.Paciente}}</td>
        </tr>
      </table>
    </div>

    <table>
      <tr>
        <td style="width: 120px;" class="noBorder">CAJA</td>
        <td style="height: 25px;">&nbsp;</td>
      </tr>
      <tr>
        <td style="width: 120px;" class="noBorder">CUBETA</td>
        <td style="height: 25px;">&nbsp;</td>
      </tr>
      <tr>
        <td style="width: 120px;" class="noBorder">ARTICULADOR</td>
        <td style="height: 25px;">&nbsp;</td>
      </tr>
      <tr>
        <td style="width: 120px;" class="noBorder">PLETINAS</td>
        <td style="height: 25px;">&nbsp;</td>
      </tr>
      <tr>
        <td style="width: 120px;" class="noBorder">TORNILLOS</td>
        <td style="height: 25px;">&nbsp;</td>
      </tr>
      <tr>
        <td style="width: 120px;" class="noBorder">ANÁLOGOS</td>
        <td style="height: 25px;">&nbsp;</td>
      </tr>
      <tr>
        <td style="width: 120px;" class="noBorder">POSTE IMPRESIÓN</td>
        <td style="height: 25px;">&nbsp;</td>
      </tr>
      <tr>
        <td style="width: 120px;" class="noBorder">INTERFACE</td>
        <td style="height: 25px;">&nbsp;</td>
      </tr>
      <tr>
        <td style="width: 120px;" class="noBorder">OTROS</td>
        <td style="height: 25px;">&nbsp;</td>
      </tr>
    </table>
    <br>
  </div>
</template>

<script>
import {Printd} from 'printd'
export default {
  name: 'labelAditamentos',
  data () {
    return {
      cssText: `
       @page {
          size: auto;
          margin: 2mm 2mm 2mm 2mm;
        }
        body{
          margin: 0px;
        }
        * {
          -webkit-print-color-adjust:exact;
          }
        .box {
          font-family: sans-serif;
          font-size: .9em;
          text-align: left;
        }
        .labelTitle {
          font-size: 2rem;
          font-weight: 300;
          line-height: 1.2;
          text-align: left;
          background-color: #C892FB;
        }
        .labelSubtitle {
          font-size: 1.5rem;
          font-weight: 300;
          line-height: 1.2;
        }
        p {
          text-align: center;
        }
        table {
          margin: 0 auto;
          width: 400px;
        }
        tr>td {
          border: solid 1px #000;
        }
        tr>th {
          width: 150px;
          text-align: right;
        }
        .left {
          text-align:left;
        }
        .right {
          float:right;
        }
        .noBorder {
          border: none;
        }
        `,
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
    }
  },
  mounted () {
    // Check the required parameters (props)
    if (this.workData === undefined || this.workData === null)
      throw 'Missing prop workData in PrintedLabel1.vue'
    if (this.workIndications === undefined || this.workIndications === null)
      throw 'Missing prop workindications in PrintedLabel1.vue'
  }
}
</script>
<style>
  @page {
    size: auto;
    margin: 2mm 2mm 2mm 2mm;
  }
  body{
    margin: 0px;
  }
  * {
    -webkit-print-color-adjust:exact;
    }
  .box {
    font-family: sans-serif;
    font-size: .9em;
    text-align: left;
  }
  .labelTitle {
    font-size: 2rem;
    font-weight: 300;
    line-height: 1.2;
    text-align: left;
    background-color: #C892FB;
  }
  .labelSubtitle {
    font-size: 1.5rem;
    font-weight: 300;
    line-height: 1.2;
  }
  p {
    text-align: center;
  }
  table {
    margin: 0 auto;
    width: 400px;
  }
  tr>td {
    border: solid 1px #000;
  }
  tr>th {
    width: 150px;
    text-align: right;
  }
  .left {
    text-align:left;
  }
  .right {
    float:right;
  }
  .noBorder {
    border: none;
  }
</style>
