<template>
  <div id="printable" class="box">
    <!-- class="invisible" -->
    <!--  -->
    <p class="left">
      <span class="labelTitle" v-bind:class="cssClass()">&nbsp;&nbsp;{{workData.TipoTrabajo}}&nbsp;&nbsp;</span>
      <span class="right labelTitle">Trabajo nº {{workData.IdTrabajo}}</span>
    </p>

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
          width: 500px;
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
        .background {
          background-color: #e1A;
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
    }
  },
  methods: {
    print () {
      const d = new Printd()
      d.print( document.getElementById('printable'), this.cssText)
    },
    cssClass() {
      if (this.workData.TipoTrabajo !== undefined) {
        // var x = this.workData.TipoTrabajo.toLowerCase()
        // return x
        console.log(this.workData.TipoTrabajo)
        return 'background'
      }
      return ''
    }
  },
  mounted () {
  }
}
</script>
<style>
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
.background {
  background-color: red!important;
  color: white!important;
}
</style>