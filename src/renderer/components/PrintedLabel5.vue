<template>
  <div id="printableLabel5" class="box invisible">
    <div style="position: absolute; top: +60px; left: +130px; z-index: 1;" class="labelTitle">
      {{labelName}}
    </div>
    <div style="position: absolute;" class="labelTitle">
      <img :src="colorBackgroundJpeg" style="width: 250px; height: 70px; z-index: 0; position: absolute; left: +50px;">
    </div>
    <div style="position: absolute; top: +60px; left: +300px; z-index:2; text-align: right; width: 300px;" >
      <span class="labelSubtitle">Trabajo nº </span>
      <span class="labelTitle">{{workData.IdTrabajo}}</span>
    </div>
    <br>
    <br>
    <br>
    <br>
    <table>
      <tr>
        <td class="noBorder">Clínica o Dr/a: </td>
        <td class="noBorder">{{workData.NombreDentista}}</td>
      </tr>
      <tr>
        <td class="noBorder">Paciente: </td>
        <td class="noBorder">{{workData.Paciente}}</td>
      </tr>
    </table>

    <br>
    <br>

    <table>
      <tr>
        <td style="width: 150px;" class="noBorder">CAJA</td>
        <td style="width: 400px; height: 45px;">&nbsp;</td>
      </tr>
      <tr>
        <td style="width: 150px;" class="noBorder">CUBETA</td>
        <td style="width: 400px; height: 45px;">&nbsp;</td>
      </tr>
      <tr>
        <td style="width: 150px;" class="noBorder">ARTICULADOR</td>
        <td style="width: 400px; height: 45px;">&nbsp;</td>
      </tr>
      <tr>
        <td style="width: 150px;" class="noBorder">PLETINAS</td>
        <td style="width: 400px; height: 45px;">&nbsp;</td>
      </tr>
      <tr>
        <td style="width: 150px;" class="noBorder">TORNILLOS</td>
        <td style="width: 400px; height: 45px;">&nbsp;</td>
      </tr>
      <tr>
        <td style="width: 150px;" class="noBorder">ANÁLOGOS</td>
        <td style="width: 400px; height: 45px;">&nbsp;</td>
      </tr>
      <tr>
        <td style="width: 150px;" class="noBorder">POSTE IMPRESIÓN</td>
        <td style="width: 400px; height: 45px;">&nbsp;</td>
      </tr>
      <tr>
        <td style="width: 150px;" class="noBorder">INTERFACE</td>
        <td style="width: 400px; height: 45px;">&nbsp;</td>
      </tr>
      <tr>
        <td style="width: 150px;" class="noBorder">OTROS</td>
        <td style="width: 400px; height: 45px;">&nbsp;</td>
      </tr>
    </table>
  </div>
</template>

<script>
import {Printd} from 'printd'
export default {
  name: 'printedLabel5',
  data () {
    return {
      cssText: `
        .box {
          font-family: sans-serif;
          width: 600px;
          border: solid 1px #ccc;
          text-align: left;
          padding: 1em;
          margin: 2em auto;
          }
        .labelTitle {
          font-size: 2.5rem;
          font-weight: 300;
          line-height: 1.2;
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
          width: 500px;
        }
        tr>th {
          text-align: right;
        }
        tr>td {
          border: solid 1px #000;
        }
        tr>th {
          width: 150px;
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
        `
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
    },
    labelName: {
      type: String,
      required: true
    },
    colorBackgroundJpeg: {
      type: String,
      required: true
    }
  },
  methods: {
    print () {
      const d = new Printd()
      d.print( document.getElementById('printableLabel5'), this.cssText)
    }
  },
  mounted () {
  }
}
</script>