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
              <collapsable-action-button iconCss="fas fa-map-pin" text="Aditamentos" :callback="showAdjunts"></collapsable-action-button>
            </div>
          </div>
        </div>
      </div> <!-- row -->
      <div class="row">
        <div class="col-md-6 mb-3 mt-3">
          <label for="clinica">Clínica o Dr/a</label>
          <dentist-search id="clinica" v-model="data.IdDentista" ></dentist-search>
          <span>{{data.IdDentista}}</span>
        </div> <!-- col-md-6 -->
        <div class="col-md-6 mt-3">
          <label for="paciente">Paciente</label>
          <input type="text" class="form-control" v-model="data.Paciente">
        </div> <!-- col-md-6 -->
        <div class="col-md-3">
          <label for="tipoTrabajo">Tipo trabajo</label>
          <select class="form-control" id="tipoTrabajo" v-model="data.IdTipoTrabajo">
            <option disabled value="">Seleccione un opción</option>
            <option v-for="type in workTypes" v-bind:key="type.IdTipoTrabajo" v-bind:value="type.IdTipoTrabajo">{{type.Descripcion}}</option>
          </select>
          <span>{{data.IdTipoTrabajo}}</span>
        </div> <!-- col-md-6 -->
        <div class="col-md-4">
          <label for="color">Color</label>
          <input type="text" class="form-control" id="color" placeholder="Indique el color" v-model="data.Color">
        </div> <!-- col-md-4 -->
      </div> <!-- row -->
      <div class="row">
        <div class="col-md-12 mt-3">
          <h4>Indicaciones</h4>
          <workIndicationsTable :records="workIndications" ref="workIndications"></workIndicationsTable>
        </div> <!-- col-md-12 -->
      </div> <!-- row -->
      <div class="row">
        <div class="col-md-4 mt-3">
          <label for="fEntrada">Fecha entrada</label>
          <input type="date" class="form-control" id="fEntrada" placeholder="dd/mm/aaaa" v-model="data.FechaEntrada">
          <a href="#" class="form-text text-muted ml-2" v-on:click="setStartDateToToday()">
          <i class="far fa-calendar-alt"></i>
          Poner fecha de hoy
          </a>
        </div> <!-- col-md-4 -->
        <div class="col-md-4 mt-3">
          <label for="fPrevista">Fecha prevista</label>
          <input type="date" class="form-control" id="fPrevista" placeholder="dd/mm/aaaa" v-model="data.FechaPrevista">
        </div> <!-- col-md-4 -->
        <div class="col-md-4 mt-3">
          <label for="fSalida">Fecha terminación</label>
          <input type="date" class="form-control" id="fSalida" placeholder="dd/mm/aaaa" v-model="data.FechaTerminacion">
        </div>
      </div> <!-- row -->
      <div class="row">
        <div class="col-md-12 mt-4">
          <div ref="workAdjunctsContainer"></div>
        </div> <!-- col-md-8 -->
      </div> <!-- row -->
      <div class="row">
        <div class="col-md-12 mt-3">
          <button class="btn btn-info btn-block" v-on:click="save()" v-bind:class="{disabled: !canBeSaved()}">
            <i class="fas fa-save"></i>
            Guardar
          </button>
        </div>
      </div> <!-- row -->
    </div> <!-- container -->
    <b-modal ref="modal" size="lg" title="Imprimir etiquetas" hide-footer>
      <div class="modal-body">
        <div class="containter">
          <div class="row">
            <label for="labelText">
              Al dar de alta un nuevo trabajo se pueden imprimir hasta tres etiquetas de una vez. Seleccione las que vaya a necesitar en la lista de la izquierda, edite (si lo cree necesario) el texto a la derecha y pulse el botón Imprimir.
            </label>
          </div>
          <div class="row pt-4">
            <div class="col-md-3">
              <div class="form-check">
                <input class="cbResina" type="checkbox">
                <label class="form-check-label" for="cbResina">
                  Resina
                </label>
              </div>
              <div class="form-check">
                <input class="cbCompostura" type="checkbox">
                <label class="form-check-label" for="cbResina">
                  Compostura
                </label>
              </div>
              <div class="form-check" v-if="adjuncts !== null">
                <input class="cbResina" type="checkbox">
                <label class="form-check-label" for="cbResina">
                  Aditamentos
                </label>
              </div>
              <div class="form-check">
                <input class="cbResina" type="checkbox">
                <label class="form-check-label" for="cbResina">
                  Esqueléticos
                </label>
              </div>
              <div class="form-check">
                <input class="cbResina" type="checkbox">
                <label class="form-check-label" for="cbResina">
                  Ortodoncia
                </label>
              </div>
            </div>
            <div class="col-md-3">
              <div class="form-check">
                <input class="cbResina" type="checkbox">
                <label class="form-check-label" for="cbResina">
                  Zirconio
                </label>
              </div>
              <div class="form-check">
                <input class="cbResina" type="checkbox">
                <label class="form-check-label" for="cbResina">
                  Implantes
                </label>
              </div>
              <div class="form-check">
                <input class="cbResina" type="checkbox">
                <label class="form-check-label" for="cbResina">
                  E-Max
                </label>
              </div>
              <div class="form-check">
                <input class="cbResina" type="checkbox">
                <label class="form-check-label" for="cbResina">
                  Composite
                </label>
              </div>
              <div class="form-check">
                <input class="cbResina" type="checkbox">
                <label class="form-check-label" for="cbResina">
                  Metal-Cerámica
                </label>
              </div>
            </div>
            <div class="col-md-6">
              <textarea class="form-control" id="labelText" rows="5" cols="50" v-model="workIndicationsText"></textarea>
            </div>
          </div>
        </div>

      </div>
      <div class="modal-footer">
        <button @click="hideModal">Cancelar</button>
        <button @click="printLabel">Imprimir</button>
      </div>
    </b-modal>
    <div ref="labelContainer"></div>
  </div>
</template>

<script>
import workIndicationsTable from '../PageElements/WorkIndicationsTable'
import workTestsTable from '../PageElements/workTestsTable'
import labelEsqueleticos from '../Labels/LabelEsqueleticos'
import labelCompostura from '../Labels/labelCompostura'
import labelResina from '../Labels/LabelResina'
import labelAditamentos from '../Labels/labelAditamentos'
import labelComposite from '../Labels/labelComposite'
import collapsableActionButton from '../PageElements/CollapsableButtons/collapsableActionButton'
import workAdjuncts from '../PageElements/WorkAdjuncts'
import dentistSearch from '../PageElements/DentistSearch'
import bModal from 'bootstrap-vue'

import Vue from 'Vue'
import { getWork, getWorkTypes, getWorkIndications, insertWork, getLastId } from '../../../main/dal.js'
import _ from 'lodash'

export default {
  name: 'WorkNew',
  components: {
    workIndicationsTable,
    workTestsTable,
    collapsableActionButton,
    workAdjuncts,
    dentistSearch
  },
  data () {
    return {
      requiresValidation: false,
      data: {
        IdTrabajo: 0,
        IdDentista: 0,
        IdTipoTrabajo: 0,
        Paciente: '',
        Color: '',
        FechaEntrada: '',
        FechaPrevista: '',
        Nombre: ''
      },
      workTypes: {},
      workIndications: [],
      adjuncts: null,
      workIndicationsText: ''
    }
  },
  methods: {
    showModal() {
      debugger
      this.workIndicationsText = _.map(this.workIndications, 'Descripcion').join('\n')
      this.$refs.modal.show()
    },
    hideModal() {
      this.$refs.modal.hide()
    },
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
    showAdjunts: function() {
      if(this.adjuncts === null){
        var ComponentClass = Vue.extend(workAdjuncts)
        this.adjuncts = new ComponentClass()
        this.adjuncts.$mount()
        this.$refs.workAdjunctsContainer.appendChild(this.adjuncts.$el)
      }
    },
    save: function() {
      this.showModal()
      // this.requiresValidation = true
      // if (this.canBeSaved) {
      //   insertWork(this.data, 'labManager.sqlite').then(() => {
      //     this.data.IdTrabajo = getLastId()
      //     this.$refs.workIndications.save(this.data.IdTrabajo)
      //   })
      // }
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
  }
}
</script>
