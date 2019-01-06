<template>
  <div>
    <div class="container">
      <div class="row">
        <div class="col-md-4">
          <h1>Trabajo nº {{work.IdTrabajo}}</h1>
        </div>
        <div class="col-md-8 mt-2">
          <div class="float-right">
            <div>
              <collapsable-action-button iconCss="fas fa-map-pin" text="Aditamentos" :callback="showAdjunts" v-if="!adjunctsVisible"></collapsable-action-button>
              <collapsable-action-button iconCss="fas fa-certificate" text="Declaración de Conformidad" :callback="getDeliveryNote"></collapsable-action-button>
              <collapsable-action-button iconCss="fas fa-dolly" text="Nota de entrega" :callback="getDeclarationOfConformity"></collapsable-action-button>
              <button class="btn btn-warning dropdown-toggle" type="button" data-toggle="dropdown">
                <i class="fas fa-tags pr-1"></i>
                <span>Imprimir etiqueta</span>
              </button>
              <div class="dropdown-menu">
                <a href="#" class="dropdown-item" v-on:click="showModal('Garantia')">Garantía</a>
                <a href="#" class="dropdown-item" v-on:click="showModal('Resina')" >Resina</a>
                <a href="#" class="dropdown-item" v-on:click="showModal('Compostura')">Compostura</a>
                <a href="#" class="dropdown-item" v-on:click="showModal('Aditamentos')" v-if="workAdjuncts !== undefined">Aditamentos</a>
                <a href="#" class="dropdown-item" v-on:click="showModal('Esqueléticos')">Esqueléticos</a>
                <a href="#" class="dropdown-item" v-on:click="showModal('Ortodoncia')">Ortodoncia</a>
                <a href="#" class="dropdown-item" v-on:click="showModal('Zirconio')">Zirconio</a>
                <a href="#" class="dropdown-item" v-on:click="showModal('Implantes')">Implantes</a>
                <a href="#" class="dropdown-item" v-on:click="showModal('E-Max')">E-Max</a>
                <a href="#" class="dropdown-item" v-on:click="showModal('Composite')">Composite</a>
                <a href="#" class="dropdown-item" v-on:click="showModal('Metal-Cerámica')">Metal-Cerámica</a>
              </div> <!-- dropdown-menu -->
            </div>
          </div>
        </div>
      </div> <!-- row -->
      <div class="row">
        <div class="col-md-6 mb-3 mt-3">
          <label for="clinica">Clínica o Dr/a</label>
          <dentist-search id="clinica" v-model="$v.work.IdDentista.$model" :isInvalid="$v.work.IdDentista.$error && saveButtonPressed"></dentist-search>
          <small class="text-danger" v-if="$v.work.IdDentista.$error && saveButtonPressed">Es necesario especificar una clínica o dr/a.</small>
        </div> <!-- col-md-6 -->
        <div class="col-md-6 mt-3">
          <label for="paciente">Paciente</label>
          <input type="text" class="form-control" v-model="$v.work.Paciente.$model">
        </div> <!-- col-md-6 -->
        <div class="col-md-3">
          <label for="tipoTrabajo">Tipo trabajo</label>
          <select class="form-control" id="tipoTrabajo" v-model="$v.work.IdTipoTrabajo.$model">
            <option disabled value="">Seleccione una opción</option>
            <option v-for="type in workTypes" v-bind:key="type.IdTipoTrabajo" v-bind:value="type.IdTipoTrabajo">{{type.Descripcion}}</option>
          </select>
          <small class="text-danger" v-if="$v.work.IdTipoTrabajo.$error && saveButtonPressed">Es necesario especificar un tipo de trabajo.</small>
        </div> <!-- col-md-6 -->
        <div class="col-md-2">
          <label for="precioMetal">Precio metal</label>
          <input type="text" class="form-control" id="precioMetal" placeholder="€" v-model="$v.work.PrecioMetal.$model" :class="{'is-invalid': $v.work.PrecioMetal.$error}">
          <small class="text-danger" v-if="$v.work.PrecioMetal.$error">Aunque opcional, se requiere que el precio del metal sea válido</small>
        </div> <!-- col-md-2 -->
        <div class="col-md-4">
          <label for="color">Color</label>
          <input type="text" class="form-control" id="color" placeholder="Indique el color" v-model="$v.work.Color.$model">
        </div> <!-- col-md-4 -->
      </div> <!-- row -->
      <div class="row">
        <div class="col-md-12 mt-4">
          <h4>Indicaciones</h4>
          <workIndicationsTable v-model="workIndications" ref="workIndications"></workIndicationsTable>
        </div> <!-- col-md-12 -->
      </div> <!-- row -->
      <div class="row">
        <div class="col-md-4">
          <label for="fEntrada">Fecha entrada</label>
          <input type="date" class="form-control" id="fEntrada" placeholder="dd/mm/aaaa" v-model="work.FechaEntrada">
          <a href="#" class="form-text text-muted ml-2" v-on:click="setStartDateToToday()">
          <i class="far fa-calendar-alt"></i>
          Poner fecha de hoy
          </a>
        </div> <!-- col-md-4 -->
        <div class="col-md-4">
          <label for="fPrevista">Fecha prevista</label>
          <input type="date" class="form-control" id="fPrevista" placeholder="dd/mm/aaaa" v-model="work.FechaPrevista">
        </div> <!-- col-md-4 -->
        <div class="col-md-4">
          <label for="fSalida">Fecha terminación</label>
          <input type="date" class="form-control" id="fSalida" placeholder="dd/mm/aaaa" v-model="work.FechaTerminacion">
        </div>
      </div> <!-- row -->

      <div class="row">
        <div class="col-md-12 mt-4">
          <h4>Pruebas</h4>
          <workTestsTable v-model="workTests" :workId="work.IdTrabajo" ref="workTests"></workTestsTable>
        </div> <!-- col-md-12 -->
      </div> <!-- row -->

      <div class="row">
        <div class="col-md-12 mt-4">
          <workAdjuncts v-model="workAdjuncts" v-if="adjunctsVisible"></workAdjuncts>
        </div> <!-- col-md-8 -->
      </div> <!-- row -->
      <div class="row">
        <div class="col-md-12 mt-3">
          <button class="btn btn-secondary btn-block" type="button" @click="save">
            <i class="fas fa-save"></i>
            Guardar
          </button>
        </div>
      </div>
    </div> <!-- container -->
    <b-modal ref="modal" title="Imprimir etiqueta" hide-footer>
      <div class="modal-body">
        <label for="labelText">
          Se va a imprimir una etiqueta de tipo {{printedLabel}}. Por favor, indique el texto que aparecerá en ella a continuación y pulse Imprimir.
        </label>
        <textarea class="form-control" id="labelText" rows="4" cols="60" v-model="workIndicationsText"></textarea>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" @click="hideModal"><i class="fas fa-times-circle mr-2 position-relative" style="top: 1px;"></i>Cancelar</button>
        <button class="btn btn-secondary" @click="printLabelAndHide"><i class="fas fa-print mr-2 position-relative" style="top: 1px;"></i>Imprimir</button>
      </div>
    </b-modal>
    <div ref="labelContainer"></div>
  </div>
</template>

<script>

import { getWork, getWorkIndications, getAdjuntsOfWork, getWorkTestsList, updateWork, updateAdjuntsOfWork } from '../../../main/dal.js'
import { validId } from '../Validators/validId.js'
import { decimal } from 'vuelidate/lib/validators'
import workMixin from './WorkMixin'
import _ from 'lodash'

export default {
  name: 'workDetail',
  mixins: [workMixin],
  data () {
    return {
      printedLabel: '',
      workTests: []
    }
  },
  validations: {
    work: {
      IdTrabajo: { },
      IdDentista: { validId },
      NombreDentista: { },
      IdTipoTrabajo: { validId },
      Paciente: { },
      Color: { },
      PrecioMetal: { decimal },
      FechaEntrada: { },
      FechaPrevista: { },
      FechaTerminacion: { }
    }
  },
  methods: {
    save: function() {
      this.saveButtonPressed = true
      this.$v.$touch()
      if (!this.$v.$invalid){
        updateWork(this.work, 'labManager.sqlite').then(() => {
          this.$refs.workIndications.save(this.work.IdTrabajo)
          this.$refs.workTests.save(this.work.IdTrabajo)
        })
        this.$refs.workTests.save(this.work.IdTrabajo)
        if(this.adjunctsVisible){
          this.workAdjuncts.IdTrabajo = this.work.IdTrabajo
          if(this.workAdjunctsJustAdded){
            insertAdjuntsOfWork(this.workAdjuncts, 'labManager.sqlite')
          } else {
            updateAdjuntsOfWork(this.workAdjuncts, 'labManager.sqlite')
          }
        }
      }
    },
    showModal(labelType) {
      this.printedLabel = labelType
      if (this.workIndications !== undefined){
        this.workIndicationsText = _.map(this.workIndications, 'Descripcion').join('\n')
      } else {
        this.workIndicationsText = ''
      }
      this.$refs.modal.show()
    },
    printLabelAndHide: function() {
      printLabel()
      this.hideModal()
    },
    getDeliveryNote: function () { },
    getDeclarationOfConformity: function () { }
  },
  created () {
    this.work.IdTrabajo = parseInt(this.$route.params.id)
  },
  mounted () {
    getWork(this.work.IdTrabajo, 'labManager.sqlite').then((workDetails) => {
      this.work = workDetails
    })
    getWorkIndications(this.work.IdTrabajo, 'labManager.sqlite').then((workIndicat) => {
      this.workIndications = workIndicat
    })
    getAdjuntsOfWork(this.work.IdTrabajo, 'labManager.sqlite').then((workAdjuncts) => {
      this.workAdjuncts = workAdjuncts
      if (this.workAdjuncts !== undefined){
        this.showAdjunts(false)
      }
    })
    getWorkTestsList(this.work.IdTrabajo, 'labManager.sqlite').then((workTests) => {
      this.workTests = workTests
    })
  }
}
</script>