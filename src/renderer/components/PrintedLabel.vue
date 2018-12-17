<template>
  <div id="printable" class="box">
    <!-- class="invisible" -->
    <!--  -->
    <div style="position: absolute; top: +60px; left: +130px; z-index: 1;" class="labelTitle">
      {{workData.TipoTrabajo}}
    </div>
    <div style="position: absolute;" class="labelTitle">
      <img src="../assets/composite.jpg" style="width: 250px; height: 70px; z-index: 0; position: absolute; left: +50px;">
    </div>
    <div style="position: absolute; top: +60px; left: +300px; z-index:2; text-align: right; width: 300px;" >
      <span class="labelSubtitle">Trabajo nº </span>
      <span class="labelTitle">{{workData.IdTrabajo}}</span>
    </div>
<!-- position: absolute; top: -10px; -->
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
</style>