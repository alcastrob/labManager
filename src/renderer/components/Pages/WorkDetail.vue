<template>
  <div>
    <div class="container">
      <div class="row">
        <div class="col-md-8">
          <h1>Trabajo nº {{work.IdTrabajo}}</h1>
        </div>
        <div class="col-md-4">
          <div class="float-right">
            <button class="btn btn-warning btn-sm mt-1 dropdown-toggle" type="button" data-toggle="dropdown">
              <i class="fas fa-tags pr-1"></i>
              <span>Imprimir etiqueta</span>
            </button>
            <div class="dropdown-menu">
              <a href="#" class="dropdown-item" v-on:click="printLabel('Garantia')">Garantía</a>
              <a href="#" class="dropdown-item" v-on:click="printLabel('Resina')">Resina</a>
              <a href="#" class="dropdown-item" v-on:click="printLabel('Compostura')">Compostura</a>
              <a href="#" class="dropdown-item" v-on:click="printLabel('Aditamentos')">Aditamentos</a>
              <a href="#" class="dropdown-item" v-on:click="printLabel('Esqueléticos')">Esqueléticos</a>
              <a href="#" class="dropdown-item" v-on:click="printLabel('Ortodoncia')">Ortodoncia</a>
              <a href="#" class="dropdown-item" v-on:click="printLabel('Zirconio')">Zirconio</a>
              <a href="#" class="dropdown-item" v-on:click="printLabel('Implantes')">Implantes</a>
              <a href="#" class="dropdown-item" v-on:click="printLabel('E-Max')">E-Max</a>
              <a href="#" class="dropdown-item" v-on:click="printLabel('Composite')">Composite</a>
              <a href="#" class="dropdown-item" v-on:click="printLabel('Metal-Cerámica')">Metal-Cerámica</a>
            </div> <!-- dropdown-menu -->
          </div>
        </div>
      </div> <!-- row -->
      <div class="row">
        <div class="col-md-6 mb-3 mt-3">
          <label for="clinica">Clínica o Dr/a</label>
          <div class="input-group">
            <input class="form-control" type="text" id="clinica" placeholder="Buscar por nombre...">
            <div class="input-group-append">
              <button class="btn btn-secondary btn-outline-secondary" type="button">Buscar</button>
            </div>
          </div> <!-- input-group -->
        </div> <!-- col-md-6 -->
        <div class="col-md-6 mt-3">
          <label for="nombre">Nombre</label>
          <input type="text" class="form-control" v-model="work.Nombre">
        </div> <!-- col-md-6 -->
        <div class="col-md-5">
          <label for="paciente">Paciente</label>
          <input type="text" class="form-control" v-model="work.Paciente">
        </div> <!-- col-md-6 -->
        <div class="col-md-3">
          <label for="tipoTrabajo">Tipo trabajo</label>
          <select class="form-control" id="tipoTrabajo" v-model="work.IdTipoTrabajo">
            <option disabled value="">Seleccione un opción</option>
            <option v-for="type in workTypes" v-bind:key="type.IdTipoTrabajo" v-bind:value="type.IdTipoTrabajo">{{type.Descripcion}}</option>
          </select>
        </div> <!-- col-md-6 -->
        <div class="col-md-2">
          <label for="precioMetal">Precio metal</label>
          <input type="text" class="form-control" id="precioMetal" placeholder="€" v-model="work.PrecioMetal">
        </div> <!-- col-md-2 -->
        <div class="col-md-2">
          <label for="color">Color</label>
          <input type="text" class="form-control" id="color" placeholder="Indique el color" v-model="work.Color">
        </div> <!-- col-md-2 -->
      </div> <!-- row -->
      <div class="row">
        <div class="col-md-12 mt-3">
          <h4>Indicaciones</h4>
          <workIndicationsTable :workIndications="workIndications"></workIndicationsTable>
        </div> <!-- col-md-12 -->
      </div> <!-- row -->
      <div class="row">
        <div class="col-md-8 mt-3">
          <h4>Pruebas</h4>
          <workTestsTable :workId="workId"></workTestsTable>
        </div> <!-- col-md-8 -->
        <div class="col-md-4 mt-3">
          <label for="fEntrada">Fecha entrada</label>
          <input type="date" class="form-control" id="fEntrada" placeholder="dd/mm/aaaa" v-model="work.FechaEntrada">
          <br>
          <label for="fPrevista">Fecha prevista</label>
          <input type="date" class="form-control" id="fPrevista" placeholder="dd/mm/aaaa" v-model="work.FechaPrevista">
          <br>
          <label for="fSalida">Fecha salida</label>
          <input type="date" class="form-control" id="fSalida" placeholder="dd/mm/aaaa" v-model="work.FechaTerminacion">
        </div> <!-- col-md-4 -->
      </div> <!-- row -->
    </div> <!-- container -->
  <printed-label1 ref="label1" :workData="work" :workIndications="workIndications" :labelName="labelName" :colorBackgroundJpeg="labelColorBackgroundJpeg"></printed-label1>
  <printed-label2 ref="label2" :workData="work" :workIndications="workIndications" :labelName="labelName" :colorBackgroundJpeg="labelColorBackgroundJpeg"></printed-label2>
  <printed-label3 ref="label3" :workData="work" :workIndications="workIndications" :labelName="labelName" :colorBackgroundJpeg="labelColorBackgroundJpeg"></printed-label3>
  <printed-label4 ref="label4" :workData="work" :workIndications="workIndications" :labelName="labelName" :colorBackgroundJpeg="labelColorBackgroundJpeg"></printed-label4>
  <printed-label5 ref="label5" :workData="work" :workIndications="workIndications" :labelName="labelName" :colorBackgroundJpeg="labelColorBackgroundJpeg"></printed-label5>
  </div>
</template>

<script>
import workIndicationsTable from '../PageElements/WorkIndicationsTable'
import workTestsTable from '../PageElements/workTestsTable'
import printedLabel1 from '../PrintedLabel1'
import printedLabel2 from '../PrintedLabel2'
import printedLabel3 from '../PrintedLabel3'
import printedLabel4 from '../PrintedLabel4'
import printedLabel5 from '../PrintedLabel5'
import { getWorkDetails, getWorkTypes, getWorkIndications } from '../../../main/dal.js'

export default {
  name: 'workDetail',
  props: {
    workId: Number
  },
  components: {
    workIndicationsTable,
    workTestsTable,
    printedLabel1,
    printedLabel2,
    printedLabel3,
    printedLabel4,
    printedLabel5
  },
  data () {
    return {
      work: {},
      workTypes: {},
      workIndications: {},
      _labelName: ''
    }
  },
  methods: {
    printLabel: function(type) {
      this._labelName = type
      switch(type) {
        case 'Garantia':
          break;
        case 'Composite':
        case 'E-Max':
        case 'Implantes':
        case 'Metal-Cerámica':
        case 'Zirconio':
          this.$refs.label1.print()
          break;
        case 'Esqueléticos':
          this.$refs.label2.print()
          break;
        case 'Compostura':
        case 'Ortodoncia':
          this.$refs.label3.print()
          break;
        case 'Resina':
          this.$refs.label4.print()
          break;
        case 'Aditamentos':
          this.$refs.label5.print()
        default:
          return ''
      }
    }
  },
  mounted () {
    getWorkTypes('labManager.sqlite').then((types) => {
      this.workTypes = types
    })
    getWorkDetails(this.workId, 'labManager.sqlite').then((workDetails) => {
      this.work = workDetails
    })
    getWorkIndications(this.workId, 'labManager.sqlite').then((workIndicat) => {
      this.workIndications = workIndicat
    })
  },
  computed: {
    labelColorBackgroundJpeg: function() {
      switch(this._labelName) {
        case 'Garantia':
          return  ''
        case 'Resina':
          return '~@/assets/resina.jpg'
        case 'Compostura':
          return '~@/assets/compostura.jpg'
        case 'Aditamentos':
          return ''
        case 'Esqueléticos':
          return '~@/assets/esqueleticos.jpg'
        case 'Ortodoncia':
          return '~@/assets/ortodoncia.jpg'
        case 'Zirconio':
          return '~@/assets/zirconio.jpg'
        case 'Implantes':
          return '~@/assets/implantes.jpg'
        case 'E-max':
          return '~@/assets/e-max.jpg'
        case 'Composite':
          return '~@/assets/composite.jpg'
        case 'Metal-Cerámica':
          return '~@/assets/metal-ceramica.jpg'
        default:
          return ''
      }
    },
    labelName: function() {
      if (this._labelName !== undefined)
      {
        return this._labelName
      }
      else {
        return ''
      }
    }
   }
}
</script>

<style>
</style>
