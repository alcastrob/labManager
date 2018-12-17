<template>
  <div id="printableLabel1" class="box invisible">
    <div style="position: absolute; top: +60px; left: 0px; z-index: 10;" class="labelTitle">
      {{labelName}}
    </div>
    <div style="position: absolute;" class="labelTitle">
      <img src="~@/assets/composite.jpg" style="width: 250px; height: 70px; z-index: 0; position: absolute; left: +50px;">
      <!-- <img :src="background" style="width: 250px; height: 70px; z-index: 0; position: absolute; left: +50px;"> -->
      <!-- <img src="~@/assets/composite.jpg" style="width: 250px; height: 70px; z-index: 0; position: absolute; left: +50px;" v-if="labelName==='Composite'">
      <img src="~@/assets/e-max.jpg" style="width: 250px; height: 70px; z-index: 0; position: absolute; left: +50px;" v-if="labelName==='E-Max'">
      <img src="~@/assets/implantes.jpg" style="width: 250px; height: 70px; z-index: 0; position: absolute; left: +50px;" v-if="labelName==='Implantes'">
      <img src="~@/assets/metal-ceramica.jpg" style="width: 250px; height: 70px; z-index: 0; position: absolute; left: +50px;" v-if="labelName==='Metal-Cerámica'">
      <img src="~@/assets/zirconio.jpg" style="width: 250px; height: 70px; z-index: 0; position: absolute; left: +50px;" v-if="labelName==='Zirconio'"> -->
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
      <tr>
        <td class="noBorder">Trabajos a realizar:</td>
        <td class="noBorder">Color: {{workData.Color}}</td>
      </tr>
      <tr v-for="detail in workIndications" :key="detail.IdTrabajoDetalle">
        <td colspan="2" class="noBorder">&bull; {{detail.Descripcion}}</td>
      </tr>
    </table>

    <br>
    <br>

    <table>
      <tr>
        <th></th>
        <th>Entrada</th>
        <th>Salida</th>
        <th>Hora</th>
      </tr>
      <tr>
        <td>P. METAL</td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
      <tr>
        <td>BIZCOCHO</td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
      <tr>
        <td>TERMINAR</td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
    </table>
    <br>
    <span>Nota:</span>
    <br>
    <br>
    &nbsp;
  </div>
</template>

<script>
import {Printd} from 'printd'
export default {
  name: 'printedLabel1',
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
        `,
      name: ''
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
      // debugger
      console.log(label)
      this.name = label
      this.$forceUpdate()
      const d = new Printd()
      d.print( document.getElementById('printableLabel1'), this.cssText)
    }
  },
  computed: {
    labelName: function() {
      return this.name
    }
  }
}
</script>