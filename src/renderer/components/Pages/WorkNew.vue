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
              <collapsable-button iconCss="fas fa-map-pin" text="Aditamentos" eventName="work:visibleWorkAdjuncts"></collapsable-button>
              <button class="btn btn-warning dropdown-toggle" type="button" data-toggle="dropdown">
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
          <input type="text" class="form-control" v-model="data.Nombre">
        </div> <!-- col-md-6 -->
        <div class="col-md-5">
          <label for="paciente">Paciente</label>
          <input type="text" class="form-control" v-model="data.Paciente">
        </div> <!-- col-md-6 -->
        <div class="col-md-3">
          <label for="tipoTrabajo">Tipo trabajo</label>
          <select class="form-control" id="tipoTrabajo" v-model="data.IdTipoTrabajo">
            <option disabled value="">Seleccione un opción</option>
            <option v-for="type in workTypes" v-bind:key="type.IdTipoTrabajo" v-bind:value="type.IdTipoTrabajo">{{type.Descripcion}}</option>
          </select>
        </div> <!-- col-md-6 -->
        <div class="col-md-4">
          <label for="color">Color</label>
          <input type="text" class="form-control" id="color" placeholder="Indique el color" v-model="data.Color">
        </div> <!-- col-md-4 -->
      </div> <!-- row -->
      <div class="row">
        <div class="col-md-12 mt-3">
          <h4>Indicaciones</h4>
          <workIndicationsTable :workIndications="workIndications"></workIndicationsTable>
        </div> <!-- col-md-12 -->
      </div> <!-- row -->
      <div class="row">
        <div class="col-md-6 mt-3">
          <label for="fEntrada">Fecha entrada</label>
          <input type="date" class="form-control" id="fEntrada" placeholder="dd/mm/aaaa" v-model="data.FechaEntrada">
          <a href="#" class="form-text text-muted ml-2" v-on:click="setStartDateToToday()">
          <i class="far fa-calendar-alt"></i>
          Poner fecha de hoy
          </a>
        </div> <!-- col-md-4 -->
        <div class="col-md-6 mt-3">
          <label for="fPrevista">Fecha prevista</label>
          <input type="date" class="form-control" id="fPrevista" placeholder="dd/mm/aaaa" v-model="data.FechaPrevista">
        </div> <!-- col-md-4 -->
      </div> <!-- row -->
      <div class="row">
        <div class="col-md-12 mt-4">
          <div ref="workAdjunctsContainer"></div>
        </div> <!-- col-md-8 -->
      </div> <!-- row -->
      <div class="row">
        <div class="col-md-12 mt-3">
          <button class="btn btn-info btn-block" v-on:click="save()" v-bind:class="{disabled: !canBeSaved()}">Guardar</button>
        </div>
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
import collapsableButton from '../PageElements/collapsableButton'
import workAdjuncts from '../PageElements/WorkAdjuncts'

import Vue from 'Vue'
import { getWork, getWorkTypes, getWorkIndications, insertWork } from '../../../main/dal.js'

export default {
  name: 'WorkNew',
  components: {
    workIndicationsTable,
    workTestsTable,
    collapsableButton,
    workAdjuncts
  },
  data () {
    return {
      requiresValidation: false,
      data: {
        idTrabajo: 0,
        NombreDentista: '',
        idTipoTrabajo: 0,
        Paciente: '',
        Color: '',
        FechaEntrada: '',
        FechaPrevista: '',
        Nombre: ''
      },
      workTypes: {},
      workIndications: {},
      adjuncts: null

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
    },
    save: function() {
      this.requiresValidation = true

      if (this.canBeSaved) {
        insertWork(this.data, 'labManager.sqlite')
      }
    },
    canBeSaved: function() {
      return true
      // return !this.requiresValidation
      //  || this.data.NombreClinica !== ''
    },
    setStartDateToToday: function() {
      var today = new Date()
      var dd = today.getDate()

      var mm = today.getMonth()+1
      var yyyy = today.getFullYear()
      if(dd<10) {
          dd='0'+dd;
      }

      if(mm<10) {
          mm='0'+mm;
      }

      this.data.FechaEntrada = yyyy + '-' + mm + '-' + dd
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
    this.$root.$on('work:visibleWorkAdjuncts', () => {
      if(this.adjuncts === null){
        var ComponentClass = Vue.extend(workAdjuncts)
        this.adjuncts = new ComponentClass()
        this.adjuncts.$mount()
        this.$refs.workAdjunctsContainer.appendChild(this.adjuncts.$el)
      }
    })
  }
}
</script>

<style>
</style>
