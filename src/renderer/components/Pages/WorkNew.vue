<template>
<div>
    <div class="container">
      <div class="row">
        <div class="col-md-6">
          <h1>Nuevo Trabajo</h1>
        </div>
        <div class="col-md-6 mt-2">
          <div class="float-right">
            <div>
              <button class="btn btn-warning btn-sm dropdown-toggle" type="button" data-toggle="dropdown">
                <i class="fas fa-tags pr-1"></i>
                <span>Imprimir etiqueta</span>
              </button>
              <div class="dropdown-menu">
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
          <h4>Aditamentos</h4>
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
    <div ref="labelContainer"></div>
  </div>
</template>

<script>
import workIndicationsTable from '../PageElements/WorkIndicationsTable'
import workTestsTable from '../PageElements/workTestsTable'
import labelEsqueleticos from '../Labels/LabelEsqueleticos'
import labelCompostura from '../Labels/labelCompostura'
import labelOrtodoncia from '../Labels/labelOrtodoncia'
import labelResina from '../Labels/LabelResina'
import labelAditamentos from '../Labels/labelAditamentos'
import labelComposite from '../Labels/labelComposite'
import labelEmax from '../Labels/labelEmax'
import labelImplantes from '../Labels/labelImplantes'
import labelMetalCeramica from '../Labels/labelMetalCeramica'
import labelZirconio from '../Labels/labelZirconio'

import Vue from 'Vue'
import { getWork, getWorkTypes, getWorkIndications } from '../../../main/dal.js'

export default {
  name: 'WorkNew',
  components: {
    workIndicationsTable,
    workTestsTable
  },
  data () {
    return {
      work: {
        idTrabajo: 0,
        NombreDentista: '',
        idTipoTrabajo: 0,
        Paciente: '',
        Color: '',
        FechaEntrada: '',
        FechaPrevista: '',
        FechaTerminacion: '',
        Precio: 0,
        Nombre: ''
      },
      workTypes: {},
      workIndications: {}
    }
  },
  methods: {
    printLabel: function(type) {
      var ComponentClass = this.mapType(type)
      var instance = new ComponentClass({
          propsData: {
            workData: this.work,
            workIndications: this.workIndications
            }
      })
      instance.$mount()
      this.$refs.labelContainer.appendChild(instance.$el)
      instance.print(type)
      this.$refs.labelContainer.removeChild(instance.$el)
    },
    mapType(type) {
      switch(type) {
        case 'Garantia':
          //TO DO
          return Vue.extend(labelGarantia)
        case 'Composite':
          return Vue.extend(labelComposite)
        case 'E-Max':
          return Vue.extend(labelEmax)
        case 'Implantes':
          return Vue.extend(labelImplantes)
        case 'Metal-Cerámica':
          return Vue.extend(labelMetalCeramica)
        case 'Zirconio':
          return Vue.extend(labelZirconio)
        case 'Esqueléticos':
          return Vue.extend(labelEsqueleticos)
        case 'Compostura':
          return Vue.extend(labelCompostura)
        case 'Ortodoncia':
          return Vue.extend(labelOrtodoncia)
        case 'Resina':
          return Vue.extend(labelResina)
        case 'Aditamentos':
          return Vue.extend(labelAditamentos)
        default:
          throw 'Unexpected label type in WorkDetail.printLabel()'
      }
    }
  },
  mounted () {
    getWorkTypes('labManager.sqlite').then((types) => {
      this.workTypes = types
    })
    getWork(this.workId, 'labManager.sqlite').then((workDetails) => {
      this.work = workDetails
    })
    getWorkIndications(this.workId, 'labManager.sqlite').then((workIndicat) => {
      this.workIndications = workIndicat
    })
  },
}
</script>

<style>
</style>
