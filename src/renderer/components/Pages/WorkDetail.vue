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
              <!-- <a href="#" class="btn btn-warning btn-collapsible"  @click="doValidatorExtraChecks">Validacion</a> -->
              <collapsible-action-button iconCss="fas fa-map-pin" text="Aditamentos" :callback="showAdjunts" v-if="!adjunctsVisible && !readOnly"></collapsible-action-button>
              <collapsible-action-button iconCss="fas fa-certificate" text="Declaración de Conformidad" :callback="showConformity" title="La declaración de conformidad requiere que se establezca una fecha de terminación del trabajo" :disabled="$v.work.FechaTerminacion.$model === '' || $v.work.FechaTerminacion.$model === null || $v.work.FechaTerminacion.$anyError"></collapsible-action-button>
              <collapsible-action-button iconCss="fas fa-dolly" text="Nota de entrega" :callback="getDeliveryNote" title="La nota de entrega requiere que se establezca una fecha de terminación del trabajo" :disabled="$v.work.FechaTerminacion.$model === '' || $v.work.FechaTerminacion.$model === null || $v.work.FechaTerminacion.$anyError"></collapsible-action-button>
              <button class="btn btn-warning dropdown-toggle" type="button" data-toggle="dropdown">
                <i class="fas fa-tags pr-1"></i>
                <span>Imprimir etiqueta</span>
              </button>
              <div class="dropdown-menu">
                <a href="#" class="dropdown-item" :class="{'labeStrikethrough': $v.work.FechaTerminacion.$model === '' || $v.work.FechaTerminacion.$model === null || $v.work.FechaTerminacion.$anyError}" v-on:click="showWarrantyLabelModal" title="La nota de entrega requiere que se establezca una fecha de terminación del trabajo" >Garantía</a>
                <a href="#" class="dropdown-item" v-on:click="showLabelModal('Resina')" >Resina</a>
                <a href="#" class="dropdown-item" v-on:click="showLabelModal('Compostura')">Compostura</a>
                <a href="#" class="dropdown-item" v-on:click="showLabelModal('Aditamentos')" v-if="workAdjuncts !== undefined">Aditamentos</a>
                <a href="#" class="dropdown-item" v-on:click="showLabelModal('Esqueléticos')">Esqueléticos</a>
                <a href="#" class="dropdown-item" v-on:click="showLabelModal('Ortodoncia')">Ortodoncia</a>
                <a href="#" class="dropdown-item" v-on:click="showLabelModal('Zirconio')">Zirconio</a>
                <a href="#" class="dropdown-item" v-on:click="showLabelModal('Implantes')">Implantes</a>
                <a href="#" class="dropdown-item" v-on:click="showLabelModal('E-Max')">E-Max</a>
                <a href="#" class="dropdown-item" v-on:click="showLabelModal('Composite')">Composite</a>
                <a href="#" class="dropdown-item" v-on:click="showLabelModal('Metal-Cerámica')">Metal-Cerámica</a>
              </div> <!-- dropdown-menu -->
            </div>
          </div>
        </div>
      </div> <!-- row -->
      <div class="row" v-if="invoice !== null && invoice !== undefined">
        <div class="col-md-12">
          <span>Este trabajo está incluido en la factura <router-link :to="'/finances/invoices/' + invoice.IdFactura">{{invoice.NumFactura}}</router-link>.</span>
        </div>
      </div>
      <div class="row" v-if="readOnly">
        <div class="col-md-12">
          <em>
          <span>Este trabajo está cerrado, por lo que no se puede editar.</span>
          <br>
          <span>Si, excepcionalmente, desea editarlo (bajo su propia responsabilidad) pulse <a href="#" @click="readOnly=false">aquí</a>.</span>
          </em>
        </div>
      </div>
      <div class="row">
        <div class="col-md-8">
          <div class="row">
            <div class="col-md-6 mb-3 mt-3">
              <label for="clinica">Clínica o Dr/a</label>
              <dentist-search id="clinica" ref="clinica" v-model="$v.work.IdDentista.$model" :isInvalid="$v.work.IdDentista.$error && saveButtonPressed" :disabled="readOnly" @change="$refs.paciente.focus()" ></dentist-search>
              <small class="text-danger" v-if="$v.work.IdDentista.$error && saveButtonPressed">Es necesario especificar una clínica o dr/a.</small>
            </div> <!-- col-md-6 -->
            <div class="col-md-6 mt-3">
              <label for="paciente">Paciente</label>
              <input type="text" class="form-control" v-model="$v.work.Paciente.$model" :disabled="readOnly"  ref="paciente">
            </div> <!-- col-md-6 -->
            <div class="col-md-3">
              <label for="tipoTrabajo">Tipo trabajo</label>
              <select class="form-control" id="tipoTrabajo" ref="tipoTrabajo" v-model="$v.work.IdTipoTrabajo.$model" :disabled="readOnly" :class="{'is-invalid': $v.work.IdTipoTrabajo.$error}">
                <option disabled value="">Seleccione una opción</option>
                <option v-for="type in workTypes" v-bind:key="type.IdTipoTrabajo" v-bind:value="type.IdTipoTrabajo">{{type.Descripcion}}</option>
              </select>
              <small class="text-danger" v-if="$v.work.IdTipoTrabajo.$error && saveButtonPressed">Es necesario especificar un tipo de trabajo.</small>
            </div> <!-- col-md-6 -->
            <div class="col-md-2">
              <label for="precioMetal">Precio metal</label>
              <input type="text" class="form-control" id="precioMetal" ref="precioMetal" placeholder="€" v-model="$v.work.PrecioMetal.$model" :class="{'is-invalid': $v.work.PrecioMetal.$error}" :disabled="readOnly">
              <small class="text-danger" v-if="$v.work.PrecioMetal.$error">Aunque opcional, se requiere que el precio del metal sea válido</small>
            </div> <!-- col-md-2 -->
            <div class="col-md-4">
              <label for="color">Color</label>
              <input type="text" class="form-control" id="color" placeholder="Indique el color" v-model="$v.work.Color.$model" :disabled="readOnly">
            </div> <!-- col-md-4 -->
          </div> <!-- row -->
        </div> <!-- col-md-8 -->
        <div class="col-md-4 separated-column text-left">
          <h4>Ficheros</h4>
          <imagesFileUpload :multipleFiles="true" accept="image/*" :idTrabajo="work.IdTrabajo"></imagesFileUpload>
        </div> <!-- col-md-4 -->
      </div> <!-- row -->
      <div class="row">
        <div class="col-md-12 mt-4">
          <h4>Indicaciones</h4>
          <workIndicationsTable v-model="workIndications" ref="workIndications" id="workIndications" :disabled="readOnly"></workIndicationsTable>
        </div> <!-- col-md-12 -->
      </div> <!-- row -->
      <div class="row">
        <div class="col-md-3">
          <label for="fEntrada">Fecha entrada</label>
          <input type="date" class="form-control" id="fEntrada" placeholder="dd/mm/aaaa" v-model="$v.work.FechaEntrada.$model" @blur="triggerIsDirty($event)" @input="triggerIsDirty($event)" :disabled="readOnly">
          <a href="#" class="form-text text-muted ml-2" @click="setStartDateToToday()" v-if="!readOnly">
          <i class="far fa-calendar-alt"></i>
          Poner fecha de hoy
          </a>
        </div> <!-- col-md-3 -->
        <div class="col-md-3">
          <label for="fPrevistaPreuba">Fecha prevista prueba</label>
          <input type="date" class="form-control" id="fPrevistaPrueba" placeholder="dd/mm/aaaa" v-model="$v.work.FechaPrevistaPrueba.$model" @blur="triggerIsDirty($event)" @input="triggerIsDirty($event)" :disabled="readOnly">
        </div> <!-- col-md-3 -->
        <div class="col-md-3">
          <label for="fPrevista">Fecha prevista terminación</label>
          <input type="date" class="form-control" id="fPrevista" placeholder="dd/mm/aaaa" v-model="$v.work.FechaPrevista.$model" @blur="triggerIsDirty($event)" @input="triggerIsDirty($event)" :disabled="readOnly">
        </div> <!-- col-md-3 -->
        <div class="col-md-3">
          <label for="fSalida">Fecha terminación</label>
          <input type="date" class="form-control" id="fSalida" placeholder="dd/mm/aaaa" v-model="$v.work.FechaTerminacion.$model" @blur="triggerIsDirty($event)" @input="triggerIsDirty($event)" :disabled="readOnly">
        </div> <!-- col-md-3 -->
      </div> <!-- row -->

      <div class="row">
        <div class="col-md-12 mt-4">
          <h4>Pruebas</h4>
          <workTestsTable v-model="workTests" :workId="work.IdTrabajo" ref="workTests" :disabled="readOnly"></workTestsTable>
        </div> <!-- col-md-12 -->
      </div> <!-- row -->

      <div class="row">
        <div class="col-md-12 mt-4">
          <workAdjuncts v-model="$v.workAdjuncts.$model" v-if="adjunctsVisible" :disabled="readOnly"></workAdjuncts>
        </div> <!-- col-md-8 -->
      </div> <!-- row -->
      <div class="row">
        <div class="col-md-12 mt-3">
          <button class="btn btn-secondary btn-block" type="button" @click="save()" v-if="!readOnly" ref="btnSave">
            <i class="fas fa-save"></i>
            Guardar
          </button>
          <span ref="dirtys"></span>
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
    <!-- <warrantyModal ref="warranty" :work="work"></warrantyModal> -->
    <warrantyLabel :workData="work" ref="warrantyLabel" period="TRES" class="visuallyhidden"></warrantyLabel>
    <conformityModal ref="conformity" :work="work"></conformityModal>
    <div ref="labelContainer" class="visuallyhidden"></div>
  </div>
</template>

<script>
import Vue from 'vue'
import _ from 'lodash'
import { getWork, getWorkIndications, insertAdjuntsOfWork, getAdjuntsOfWork, getWorkTestsList, updateWork, updateAdjuntsOfWork, getConfigValues, getInvoicePerWork } from '../../../main/dal.js'
import { configGet } from '../../../main/store.js'
import workMixin from './WorkMixin'
import delivery from '../Labels/Delivery'
import imagesFileUpload from '../PageElements/fileUploads/imagesFileUplodad'
import conformityModal from '../PageElements/ConformityModal'
import warrantyLabel from '../Labels/LabelGarantia'
import VueRouter from 'vue-router'
const VueScrollTo = require('vue-scrollto')
Vue.use(VueScrollTo)

export default {
  name: 'workDetail',
  mixins: [workMixin],
  components: {
    conformityModal,
    warrantyLabel,
    imagesFileUpload
  },
  data () {
    return {
      printedLabel: '',
      workTests: [],
      readOnly: false,
      invoice: undefined,
      isAdmin: false
    }
  },
  methods: {
    cleanComponent: function() {
      this.work.IdDentista = 0
      this.NombreDentista = ''
      this.work.IdTipoTrabajo = ''
      this.work.Paciente = ''
      this.work.Color = ''
      this.PrecioFinal = 0
      this.work.FechaEntrada = ''
      this.work.FechaPrevista = ''
      this.workIndications = {}
      this.$refs.workIndications.cleanComponent()
      this.workTests = {}
      this.$refs.workTests.cleanComponent()
      this.workAdjuncts = {}
      this.adjunctsVisible = false
      this.workAdjunctsJustAdded = false
      this.url = ''
      this.$v.$reset()
      this.$forceUpdate()
    },
    save: function(url) {
      this.saveButtonPressed = true
      this.$v.$touch()

      //If the rows are not dirty, nothing will happen. If not, at least the info will be persisted, or the errors in validation will show up.
      this.$refs.workIndications.addLastRow()
      this.$refs.workTests.addLastRow()
      if (this.$v.$anyError || this.$refs.workIndications.isError() || this.$refs.workTests.isError()){
        if (this.$refs.workTests.isError()){
          this.$refs.workTests.focus()
          this.$scrollTo(this.$refs.btnSave, 1000)
        }
        if (this.$refs.workIndications.isError()){
          this.$refs.workIndications.focus()
        }
        if (this.$v.work.PrecioMetal.$anyError){
          this.$refs.precioMetal.focus()
        }
        if (this.$v.work.IdTipoTrabajo.$anyError){
          this.$refs.tipoTrabajo.focus()
        }
        if (this.$v.work.IdDentista.$anyError){
          this.$refs.clinica.focus()
        }
        return false
      }

      if (this.$refs.workIndications.isDirty){
        this.$refs.workIndications.save(this.work.IdTrabajo)
      }
      var sum = parseFloat(_.sumBy(this.workIndications, function(n) {
        var temp = parseFloat(n.Precio)
        if (isNaN(temp)){
          throw 'NaN'
        } else {
          return temp
        }
      }))
      if (sum != this.work.PrecioFinal){
        this.work.PrecioFinal = sum
      }
      if (this.$v.work.$anyDirty){
        updateWork(this.work)
      }
      if (this.$refs.workTests.isDirty){
        this.$refs.workTests.save(this.work.IdTrabajo)
      }
      if(this.workAdjuncts !== undefined && this.$v.workAdjuncts.$anyDirty){
        this.workAdjuncts.IdTrabajo = this.work.IdTrabajo
        if(this.workAdjunctsJustAdded){
          insertAdjuntsOfWork(this.workAdjuncts)
        } else {
          updateAdjuntsOfWork(this.workAdjuncts)
        }
      }

      //Everything went right. Depending how do you reach this function, you'll have tow ways of leaving it
      if (url !== undefined) {
        //Direct click on the SAVE button. Just get redirected to the URL
        this.$router.push({
          path: url
        })
      } else {
        //You clicked on a print label button thar requires a previous save (and to get informed if the save was successfully or not). Get a true as return
        this.$v.$reset()
        return true
      }
    },
    showWarrantyLabelModal(){
      if (this.work.FechaTerminacion !== '' && !this.$v.work.FechaTerminacion.$anyError){
        if(this.save()) {
          this.$refs.warrantyLabel.waitLogoAndPrint()
        }
      }
    },
    showLabelModal(labelType) {
      if(this.save()) {
        this.printedLabel = labelType
        if (this.workIndications !== undefined){
          this.workIndicationsText = _.map(this.workIndications, 'Descripcion').join('\n')
        } else {
          this.workIndicationsText = ''
        }
        this.$refs.printLabelModal.show()
      }
    },
    printLabelAndHide: function() {
      this.printLabel()
      this.hideModal()
    },
    getDeliveryNote: async function () {
      if (this.save()){
        var row = await getConfigValues(['logo'])
        var ComponentClass = Vue.extend(delivery)
        var instance = new ComponentClass({
          propsData: {
            IdTrabajo: this.work.IdTrabajo,
            NombreDentista: this.work.NombreDentista,
            Paciente: this.work.Paciente,
            FechaTerminacion: new Date(this.work.FechaTerminacion),
            Detalles: this.workIndications,
            PrecioFinal: this.work.PrecioFinal,
            logo: (!row[0].valor.startsWith('data:image/png;base64,'))? 'data:image/png;base64,' + row[0].valor : row[0].valor
          }
        })
        instance.$mount()
        instance.print(this.$refs.labelContainer)
      }
    },
    showConformity(){
      if (this.save()) {
        this.$refs.conformity.show()
      }
    },
    triggerIsDirty(event){
      if (!event.currentTarget.validity.valid){
        switch (event.currentTarget.id) {
          case 'fEntrada':
            this.work.FechaEntrada = ''
            break;
          case 'fPrevista':
            this.work.FechaPrevista = ''
            break;
          case 'fPrevistaPrueba':
            this.work.FechaPrevistaPrueba = ''
            break;
          case 'fSalida':
            this.work.FechaTerminacion = ''
            break;
        }
      }
    },
    doValidatorExtraChecks() {
      this.$refs.dirtys.innerHTML = ''
      this.$refs.dirtys.innerHTML += `IdDentista: ${this.$v.work.IdDentista.$anyError} | ${this.$v.work.IdDentista.$anyDirty} <br> `
      this.$refs.dirtys.innerHTML += `Paciente: ${this.$v.work.Paciente.$anyError} | ${this.$v.work.Paciente.$anyDirty} <br> `
      this.$refs.dirtys.innerHTML += `TipoTrabajo: ${this.$v.work.IdTipoTrabajo.$anyError} | ${this.$v.work.IdTipoTrabajo.$anyDirty} <br> `
      this.$refs.dirtys.innerHTML += `PrecioMetal: ${this.$v.work.PrecioMetal.$anyError} | ${this.$v.work.PrecioMetal.$anyDirty} <br> `
      this.$refs.dirtys.innerHTML += `Color: ${this.$v.work.Color.$anyError} | ${this.$v.work.Color.$anyDirty} <br> `
      this.$refs.dirtys.innerHTML += `Indicaciones: ${this.$refs.workIndications.isError()} | ${this.$refs.workIndications.isDirty()} <br> `
      this.$refs.dirtys.innerHTML += `FechaEntrada: ${this.$v.work.FechaEntrada.$anyError} | ${this.$v.work.FechaEntrada.$anyDirty} <br> `
      this.$refs.dirtys.innerHTML += `FechaPrevista: ${this.$v.work.FechaPrevista.$anyError} | ${this.$v.work.FechaPrevista.$anyDirty} <br> `
      this.$refs.dirtys.innerHTML += `FechaTerminacion: ${this.$v.work.FechaTerminacion.$anyError} | ${this.$v.work.FechaTerminacion.$anyDirty} <br> `
      this.$refs.dirtys.innerHTML += `Pruebas: ${this.$refs.workTests.isError()} | ${this.$refs.workTests.isDirty()} <br> `
    },
    getData: async function(){
      this.work = await getWork(this.work.IdTrabajo)
      this.readOnly = this.work.FechaTerminacion !== null
      this.workIndications = await getWorkIndications(this.work.IdTrabajo)
      this.workAdjuncts = await getAdjuntsOfWork(this.work.IdTrabajo)
      if (this.workAdjuncts !== undefined){
        this.showAdjunts(false)
      }
      this.workTests = await getWorkTestsList(this.work.IdTrabajo)
      this.invoice = await getInvoicePerWork(this.work.IdTrabajo)
    }
  },
  computed: {
    isDirty(){
      if (this.readOnly){
        return false
      }
      var result = this.$v.$anyDirty
      if (this.$refs.workIndications !== undefined){
        //If the row is not dirty, nothing will happen. If not, at least the info is persisted, or the errors in validation will show up.
        this.$refs.workIndications.addLastRow()
        result = result || this.$refs.workIndications.isDirty()
      }
      if (this.$refs.workTests !== undefined){
        //If the row is not dirty, nothing will happen. If not, at least the info is persisted, or the errors in validation will show up.
        this.$refs.workTests.addLastRow()
        result = result || this.$refs.workTests.isDirty()
      }
      return result
    },
    isError(){
      var result = this.$v.$anyError
      if (this.$refs.workIndications !== undefined){
        //If the row is not dirty, nothing will happen. If not, at least the info is persisted, or the errors in validation will show up.
        this.$refs.workIndications.addLastRow()
        result = result || this.$refs.workIndications.isError()
        return result
      }
      if (this.$refs.workTests !== undefined){
        //If the row is not dirty, nothing will happen. If not, at least the info is persisted, or the errors in validation will show up.
        this.$refs.workTests.addLastRow()
        result = result || this.$refs.workTests.isError()
      }
      return result
    }
  },
  created () {
    this.work.IdTrabajo = parseInt(this.$route.params.id)
  },
  mounted () {
    this.getData()
    this.$on('topbar:save', this.save)
    this.isAdmin = configGet('isAdmin')
  }
}
</script>
<style>
  .labeStrikethrough, .labeStrikethrough:hover {
    text-decoration: line-through;
  }
</style>
