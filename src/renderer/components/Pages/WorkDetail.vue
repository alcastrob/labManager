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
                <a href="#" class="dropdown-item" v-on:click="showModal('Aditamentos')" v-if="workAdjunts !== undefined">Aditamentos</a>
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
            <option disabled value="">Seleccione un opción</option>
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
        <div class="col-md-12 mt-3">
          <h4>Indicaciones</h4>
          <workIndicationsTable v-model="workIndications" ref="workIndications"></workIndicationsTable>
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
          <label for="fSalida">Fecha terminación</label>
          <input type="date" class="form-control" id="fSalida" placeholder="dd/mm/aaaa" v-model="work.FechaTerminacion">
        </div> <!-- col-md-4 -->
      </div> <!-- row -->
      <div class="row">
      <div class="col-md-12 mt-4">
        <work-adjuncts v-model="adjuncts" v-if="adjunctsVisible"></work-adjuncts>
      </div> <!-- col-md-8 -->
    </div> <!-- row -->
      <div class="row">
        <div class="col-md-12 mt-3">
          <!-- v-on:click="save()" -->
          <!-- v-bind:class="{disabled: !canBeSaved()}" -->
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
        <button class="btn btn-secondary" @click="hideModal">Cancelar</button>
        <button class="btn btn-secondary" @click="printLabel">Imprimir</button>
      </div>
    </b-modal>
    <div ref="labelContainer"></div>
  </div>
</template>

<script>
import workIndicationsTable from '../PageElements/WorkIndicationsTable'
import workTestsTable from '../PageElements/workTestsTable'
import collapsableActionButton from '../PageElements/CollapsableButtons/collapsableActionButton'
import dentistSearch from '../PageElements/DentistSearch'
import workAdjuncts from '../PageElements/WorkAdjuncts'
import labelAditamentos from '../Labels/labelAditamentos'
import labelComposite from '../Labels/labelComposite'
import labelEsqueleticos from '../Labels/LabelEsqueleticos'
import labelCompostura from '../Labels/labelCompostura'
import labelResina from '../Labels/LabelResina'
import bModal from 'bootstrap-vue'

import Vue from 'Vue'
import { getWork, getWorkTypes, getWorkIndications, getAdjuntsOfWork } from '../../../main/dal.js'
import _ from 'lodash'
import { decimal } from 'vuelidate/lib/validators'
import { validId } from '../Validators/validId.js'

export default {
  name: 'workDetail',
  components: {
    workIndicationsTable,
    workTestsTable,
    collapsableActionButton,
    dentistSearch,
    workAdjuncts,
  },
  data () {
    return {
      workId: 0,
      work: {
        IdTrabajo: 0,
        IdDentista: 0,
        NombreDentista: '',
        IdTipoTrabajo: 0,
        Paciente: '',
        Color: '',
        PrecioMetal: 0,
        FechaEntrada: '',
        FechaPrevista: '',
        FechaTerminacion: ''
      },
      workTypes: {},
      workIndications: [],
      workIndicationsText: '',
      workAdjunts: {},
      printedLabel: '',
      adjuncts: {},
      adjunctsVisible: false
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
    showModal(labelType) {
      this.printedLabel = labelType
      if (this.workIndications !== undefined){
        this.workIndicationsText = _.map(this.workIndications, 'Descripcion').join('\n')
      } else {
        this.workIndicationsText = ''
      }
      this.$refs.modal.show()
    },
    hideModal() {
      this.$refs.modal.hide()
    },
    save: function() {
      this.saveButtonPressed = true
      this.$v.$touch()
      if (!this.$v.$invalid){
        // this.$refs.workIndications.save(this.workId)
      }
    },
    printLabel: function() {
      var ComponentClass = this.mapType(this.printedLabel)
      var instance = new ComponentClass({
          propsData: {
            workData: this.work,
            workIndicationsText: this.workIndicationsText,
            workAdjunts: this.workAdjunts
            }
      })
      instance.$mount()
      this.$refs.labelContainer.appendChild(instance.$el)
      instance.setName(this.printedLabel)
      instance.print(this.printedLabel)
      this.$refs.labelContainer.removeChild(instance.$el)
      this.hideModal()
    },
    mapType(type) {
      switch(type) {
        case 'Aditamentos':
          return Vue.extend(labelAditamentos)
        case 'Composite':
        case 'E-Max':
        case 'Implantes':
        case 'Metal-Cerámica':
        case 'Zirconio':
          return Vue.extend(labelComposite)
        case 'Esqueléticos':
          return Vue.extend(labelEsqueleticos)
        case 'Compostura':
        case 'Ortodoncia':
          return Vue.extend(labelCompostura)
        case 'Resina':
          return Vue.extend(labelResina)
        case 'Garantia':
          return Vue.extend(labelGarantia)
        default:
          throw 'Unexpected label type in WorkDetail.printLabel()'
      }
    },
    showAdjunts: function() {
       this.adjunctsVisible = true
    },
    getDeliveryNote: function() {
      console.log("DeliveryNote")
    },
    getDeclarationOfConformity() {
      console.log("DeclarationOfConformity")
    }
  },
  created () {
    this.workId = parseInt(this.$route.params.id)
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
    getAdjuntsOfWork(this.workId, 'labManager.sqlite').then((workAdjunts) => {
      this.workAdjunts = workAdjunts
      if (this.workAdjunts.length !== 0){
        this.showAdjunts()
      }
    })
  }
}
</script>