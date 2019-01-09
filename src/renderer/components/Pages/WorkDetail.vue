npm<template>
  <div>
    <div class="container">
      <div class="row">
        <div class="col-md-4">
          <h1>Trabajo nº {{work.IdTrabajo}}</h1>
        </div>
        <div class="col-md-8 mt-2">
          <div class="float-right">
            <div>
              <collapsable-action-button iconCss="fas fa-map-pin" text="Aditamentos" :callback="showAdjunts" v-if="!adjunctsVisible && !readOnly"></collapsable-action-button>
              <collapsable-action-button iconCss="fas fa-certificate" text="Declaración de Conformidad" :callback="getDeclarationOfConformity"></collapsable-action-button>
              <collapsable-action-button iconCss="fas fa-dolly" text="Nota de entrega" :callback="getDeliveryNote"></collapsable-action-button>
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
      <div class="row" v-if="readOnly">
        <div class="col-md-12">
          <span><em>Este trabajo está cerrado, por lo que no se puede editar.</em></span>
        </div>
      </div>
      <div class="row">
        <div class="col-md-6 mb-3 mt-3">
          <label for="clinica">Clínica o Dr/a</label>
          <dentist-search id="clinica" v-model="$v.work.IdDentista.$model" :isInvalid="$v.work.IdDentista.$error && saveButtonPressed" :disabled="readOnly"></dentist-search>
          <small class="text-danger" v-if="$v.work.IdDentista.$error && saveButtonPressed">Es necesario especificar una clínica o dr/a.</small>
        </div> <!-- col-md-6 -->
        <div class="col-md-6 mt-3">
          <label for="paciente">Paciente</label>
          <input type="text" class="form-control" v-model="$v.work.Paciente.$model" :disabled="readOnly">
        </div> <!-- col-md-6 -->
        <div class="col-md-3">
          <label for="tipoTrabajo">Tipo trabajo</label>
          <select class="form-control" id="tipoTrabajo" v-model="$v.work.IdTipoTrabajo.$model" :disabled="readOnly">
            <option disabled value="">Seleccione una opción</option>
            <option v-for="type in workTypes" v-bind:key="type.IdTipoTrabajo" v-bind:value="type.IdTipoTrabajo">{{type.Descripcion}}</option>
          </select>
          <small class="text-danger" v-if="$v.work.IdTipoTrabajo.$error && saveButtonPressed">Es necesario especificar un tipo de trabajo.</small>
        </div> <!-- col-md-6 -->
        <div class="col-md-2">
          <label for="precioMetal">Precio metal</label>
          <input type="text" class="form-control" id="precioMetal" placeholder="€" v-model="$v.work.PrecioMetal.$model" :class="{'is-invalid': $v.work.PrecioMetal.$error}" :disabled="readOnly">
          <small class="text-danger" v-if="$v.work.PrecioMetal.$error">Aunque opcional, se requiere que el precio del metal sea válido</small>
        </div> <!-- col-md-2 -->
        <div class="col-md-4">
          <label for="color">Color</label>
          <input type="text" class="form-control" id="color" placeholder="Indique el color" v-model="$v.work.Color.$model" :disabled="readOnly">
        </div> <!-- col-md-4 -->
      </div> <!-- row -->
      <div class="row">
        <div class="col-md-12 mt-4">
          <h4>Indicaciones</h4>
          <workIndicationsTable v-model="workIndications" ref="workIndications" :disabled="readOnly"></workIndicationsTable>
        </div> <!-- col-md-12 -->
      </div> <!-- row -->
      <div class="row">
        <div class="col-md-4">
          <label for="fEntrada">Fecha entrada</label>
          <input type="date" class="form-control" id="fEntrada" placeholder="dd/mm/aaaa" v-model="work.FechaEntrada" :disabled="readOnly">
          <a href="#" class="form-text text-muted ml-2" v-on:click="setStartDateToToday()" v-if="!readOnly">
          <i class="far fa-calendar-alt"></i>
          Poner fecha de hoy
          </a>
        </div> <!-- col-md-4 -->
        <div class="col-md-4">
          <label for="fPrevista">Fecha prevista</label>
          <input type="date" class="form-control" id="fPrevista" placeholder="dd/mm/aaaa" v-model="work.FechaPrevista" :disabled="readOnly">
        </div> <!-- col-md-4 -->
        <div class="col-md-4">
          <label for="fSalida">Fecha terminación</label>
          <input type="date" class="form-control" id="fSalida" placeholder="dd/mm/aaaa" v-model="work.FechaTerminacion" :disabled="readOnly">
        </div>
      </div> <!-- row -->

      <div class="row">
        <div class="col-md-12 mt-4">
          <h4>Pruebas</h4>
          <workTestsTable v-model="workTests" :workId="work.IdTrabajo" ref="workTests" :disabled="readOnly"></workTestsTable>
        </div> <!-- col-md-12 -->
      </div> <!-- row -->

      <div class="row">
        <div class="col-md-12 mt-4">
          <workAdjuncts v-model="workAdjuncts" v-if="adjunctsVisible" :disabled="readOnly"></workAdjuncts>
        </div> <!-- col-md-8 -->
      </div> <!-- row -->
      <div class="row">
        <div class="col-md-12 mt-3">
          <button class="btn btn-secondary btn-block" type="button" @click="save" v-if="!readOnly">
            <i class="fas fa-save"></i>
            Guardar
          </button>
        </div>
      </div>
    </div> <!-- container -->
    <b-modal ref="printLabelModal" title="Imprimir etiqueta" hide-footer>
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
    <b-modal ref="conformityModal" title="Declaración de Conformidad" hide-footer>
      <div class="modal-body">
        <span>
          Este trabajo no tiene una declaración de conformidad previa, por lo que se va a crear una. Por favor, indique los productos y lotes usados en este trabajo, así como el número de meses que aplica la garantía.
        </span><br>
        <label for="meses" class="pt-2">Número de meses de garantía</label>
        <input type="number" name="meses" value=12 class="form-control">
        <label for="tablaProductos" class="pt-3">Productos y Lotes incluidos</label>
        <ul>
          <li v-for="batch in batches" v-bind:key="batch.IdProductoLote" class="batchLine">{{batch.Descripcion}} <i class="fas fa-times-circle" @click="deleteBatch(batch.IdProductoLote)"></i></li>
        </ul>
        <label for="nombreProctoABuscar" class="pt-3">Producto y lote a añadir:</label>
        <productSearch name="nombreProductoABuscar"></productSearch>
        <!-- <input type="text" name="nombreProductoABuscar" class="form-control"> -->
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" @click="$refs.conformityModal.hide()"><i class="fas fa-times-circle mr-2 position-relative" style="top: 1px;"></i>Cancelar</button>
        <button class="btn btn-secondary" @click=""><i class="fas fa-print mr-2 position-relative" style="top: 1px;"></i>Crear e imprimir</button>
      </div>
    </b-modal>
    <div ref="labelContainer"></div>
  </div>
</template>

<script>

import Vue from 'vue'
import { getWork, getWorkIndications, insertAdjuntsOfWork, getAdjuntsOfWork, getWorkTestsList, updateWork, updateAdjuntsOfWork, getConformityDeclaration, insertConformityDeclaration, getConformityDeclarationDetails, insertConformityDeclarationDetails } from '../../../main/dal.js'
import { validId } from '../Validators/validId.js'
import { decimal } from 'vuelidate/lib/validators'
import workMixin from './WorkMixin'
import conformity from '../Labels/Conformity'
import delivery from '../Labels/Delivery'
import productSearch from '../PageElements/ProductSearch'
import _ from 'lodash'

export default {
  name: 'workDetail',
  mixins: [workMixin],
  components: {
    conformity,
    productSearch
  },
  data () {
    return {
      printedLabel: '',
      workTests: [],
      readOnly: false,
      batches: []
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
      this.$refs.printLabelModal.show()
    },
    printLabelAndHide: function() {
      printLabel()
      this.hideModal()
    },
    getDeliveryNote: function () {
      var ComponentClass = Vue.extend(delivery)
      var instance = new ComponentClass({
        propsData: {
          IdTrabajo: this.work.IdTrabajo,
          NombreDentista: this.work.NombreDentista,
          Paciente: this.work.Paciente,
          FechaTerminacion: new Date(this.work.FechaTerminacion),
          Detalles: this.workIndications,
          PrecioFinal: this.work.PrecioFinal
        }
      })
      instance.$mount()
      this.$refs.labelContainer.appendChild(instance.$el)
      instance.print()
      this.$refs.labelContainer.removeChild(instance.$el)
    },
    getDeclarationOfConformity: function () {
      var ComponentClass = Vue.extend(conformity)
      var currenDetails = null
      getConformityDeclaration(this.work.IdTrabajo, 'labManager.sqlite').then((declaration) => {
        var instance
        if (declaration.data !== undefined){
          //1. Check if the note exists -> Use its data
          instance = new ComponentClass({
          propsData: {
            conformityDeclaration: declaration.data,
            conformityDeclarationDetails: declaration.details
          }
        })
        } else {
          //2. If not, ask the user for the warranty months and create it -> Use its data
          this.$refs.conformityModal.show()
        }
        // instance.$mount()
        // this.$refs.labelContainer.appendChild(instance.$el)
        // instance.print()
        // this.$refs.labelContainer.removeChild(instance.$el)
      })
    },
    deleteBatch(idProductoLote){
      this.batches = _.remove(this.batches, function(element) {
        return element.IdProductoLote !== idProductoLote
      })
    }
  },
  created () {
    this.work.IdTrabajo = parseInt(this.$route.params.id)
  },
  mounted () {
    getWork(this.work.IdTrabajo, 'labManager.sqlite').then((workDetails) => {
      this.work = workDetails
      this.readOnly = workDetails.FechaTerminacion !== null
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
    this.batches = [{
      IdProductoLote: 1,
      Descripcion: 'Producto 1'
    }, {
      IdProductoLote: 2,
      Descripcion: 'Producto 2'
    }]
  }
}
</script>
<style>
.batchLine i {
  visibility: hidden;
}

.batchLine:hover i {
  visibility: visible;
}
</style>