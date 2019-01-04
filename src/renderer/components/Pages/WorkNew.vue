<template>
<div>
  <div class="container">
    <div class="row">
      <div class="col-md-6">
        <h1>Nuevo Trabajo</h1>
      </div> <!-- col-md-6 -->
      <div class="col-md-6 mt-2">
        <div class="float-right">
          <div>
            <collapsable-action-button iconCss="fas fa-map-pin" text="Aditamentos" :callback="showAdjunts" v-if="!adjunctsVisible"></collapsable-action-button>
          </div>
        </div>
      </div>
    </div> <!-- row -->
    <div class="row">
      <div class="col-md-6 mb-3 mt-3">
        <label for="clinica">Clínica o Dr/a</label>
        <dentist-search id="clinica" v-model="$v.work.IdDentista.$model" ref="dentist" :isInvalid="$v.work.IdDentista.$error && saveButtonPressed"></dentist-search>
        <small class="text-danger" v-if="$v.work.IdDentista.$error && saveButtonPressed">Es necesario especificar una clínica o dr/a.</small>
        <!-- <span>{{work.IdDentista}}</span> -->
      </div> <!-- col-md-6 -->
      <div class="col-md-6 mt-3">
        <label for="paciente">Paciente</label>
        <input type="text" class="form-control" v-model="$v.work.Paciente.$model">
      </div> <!-- col-md-6 -->
      <div class="col-md-3">
        <label for="tipoTrabajo">Tipo trabajo</label>
        <select class="form-control" id="tipoTrabajo" v-model="$v.work.IdTipoTrabajo.$model" :class="{'is-invalid': $v.work.IdTipoTrabajo.$error}">
          <option disabled value="">Seleccione una opción</option>
          <option v-for="type in workTypes" v-bind:key="type.IdTipoTrabajo" v-bind:value="type.IdTipoTrabajo">{{type.Descripcion}}</option>
        </select>
        <small class="text-danger" v-if="$v.work.IdTipoTrabajo.$error && saveButtonPressed">Es necesario especificar un tipo de trabajo.</small>
        <!-- <span>{{work.IdTipoTrabajo}}</span> -->
      </div> <!-- col-md-6 -->
      <div class="col-md-4">
        <label for="color">Color</label>
        <input type="text" class="form-control" id="color" placeholder="Indique el color" v-model="work.Color">
      </div> <!-- col-md-4 -->
    </div> <!-- row -->
    <div class="row">
      <div class="col-md-12 mt-3">
        <h4>Indicaciones</h4>
        <workIndicationsTable v-model="workIndications" ref="workIndications"></workIndicationsTable>
      </div> <!-- col-md-12 -->
    </div> <!-- row -->
    <div class="row">
      <div class="col-md-6 mt-3">
        <label for="fEntrada">Fecha entrada</label>
        <input type="date" class="form-control" id="fEntrada" placeholder="dd/mm/aaaa" v-model="work.FechaEntrada">
        <a href="#" class="form-text text-muted ml-2" v-on:click="setStartDateToToday()">
        <i class="far fa-calendar-alt"></i>
        Poner fecha de hoy
        </a>
      </div> <!-- col-md-6 -->
      <div class="col-md-6 mt-3">
        <label for="fPrevista">Fecha prevista</label>
        <input type="date" class="form-control" id="fPrevista" placeholder="dd/mm/aaaa" v-model="work.FechaPrevista">
      </div> <!-- col-md-6 -->
      <!-- <div class="col-md-4 mt-3">
        <label for="fSalida">Fecha terminación</label>
        <input type="date" class="form-control" id="fSalida" placeholder="dd/mm/aaaa" v-model="work.FechaTerminacion">
      </div> -->
    </div> <!-- row -->
    <div class="row">
      <div class="col-md-12 mt-4">
        <workAdjuncts v-model="workAdjuncts" v-if="adjunctsVisible"></workAdjuncts>
      </div> <!-- col-md-8 -->
    </div> <!-- row -->
    <div class="row">
      <div class="col-md-12 mt-3">
        <button class="btn btn-secondary btn-block" v-on:click="save()">
          <i class="fas fa-save"></i>
          Guardar
        </button>
      </div>
    </div> <!-- row -->
  </div> <!-- container -->
  <b-modal ref="modal" size="lg" title="Imprimir etiquetas" hide-footer @hidden="goBack()">
    <div class="modal-body">
      <div class="containter">
        <div class="row">
          <label for="labelText">
            Al dar de alta un nuevo trabajo se pueden imprimir múltiples etiquetas de una vez. Seleccione las que vaya a necesitar en la lista de la izquierda, edite (si lo cree necesario) el texto a la derecha y pulse el botón Imprimir.
          </label>
        </div>
        <div class="row pt-4">
          <div class="col-md-3">
            <div class="form-check">
              <input class="form-check-input" id="cbResina" type="checkbox" ref="cbResina" @change="setBtnPrintEnabled">
              <label class="form-check-label" for="cbResina">
                Resina
              </label>
            </div>
            <div class="form-check">
              <input class="form-check-input" id="cbCompostura" type="checkbox" ref="cbCompostura" @change="setBtnPrintEnabled">
              <label class="form-check-label" for="cbCompostura">
                Compostura
              </label>
            </div>
            <div class="form-check" v-if="adjunctsVisible">
              <input class="form-check-input" id="cbAditamentos" type="checkbox" ref="cbAditamentos" @change="setBtnPrintEnabled">
              <label class="form-check-label" for="cbAditamentos">
                Aditamentos
              </label>
            </div>
            <div class="form-check">
              <input class="form-check-input" id="cbEsqueletico" type="checkbox" ref="cbEsqueletico" @change="setBtnPrintEnabled">
              <label class="form-check-label" for="cbEsqueletico">
                Esqueléticos
              </label>
            </div>
            <div class="form-check">
              <input class="form-check-input" id="cbOrtodoncia" type="checkbox" ref="cbOrtodoncia" @change="setBtnPrintEnabled">
              <label class="form-check-label" for="cbOrtodoncia">
                Ortodoncia
              </label>
            </div>
          </div>
          <div class="col-md-3">
            <div class="form-check">
              <input class="form-check-input" id="cbZirconio" type="checkbox" ref="cbZirconio" @change="setBtnPrintEnabled">
              <label class="form-check-label" for="cbZirconio">
                Zirconio
              </label>
            </div>
            <div class="form-check">
              <input class="form-check-input" id="cbImplantes" type="checkbox" ref="cbImplantes" @change="setBtnPrintEnabled">
              <label class="form-check-label" for="cbImplantes">
                Implantes
              </label>
            </div>
            <div class="form-check">
              <input class="form-check-input" id="cbEmax" type="checkbox" ref="cbEmax" @change="setBtnPrintEnabled">
              <label class="form-check-label" for="cbEmax">
                E-Max
              </label>
            </div>
            <div class="form-check">
              <input class="form-check-input" id="cbComposite" type="checkbox" ref="cbComposite" @change="setBtnPrintEnabled">
              <label class="form-check-label" for="cbComposite">
                Composite
              </label>
            </div>
            <div class="form-check">
              <input class="form-check-input" id="cbMetalCeramica" type="checkbox" ref="cbMetalCeramica" @change="setBtnPrintEnabled">
              <label class="form-check-label" for="cbMetalCeramica">
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
      <button class="btn btn-secondary" @click="hideModal">No imprimir nada</button>
      <button class="btn btn-secondary" @click="printLabels" disabled ref="btnPrint">Imprimir</button>
    </div>
  </b-modal>
  <div ref="labelContainer"></div>
</div>
</template>

<script>

import { insertWork, getLastId, insertAdjuntsOfWork } from '../../../main/dal.js'
import { validId } from '../Validators/validId.js'
import workMixin from './WorkMixin'

export default {
  name: 'WorkNew',
  mixins: [workMixin],
  validations: {
    work: {
      IdTrabajo: { },
      IdDentista: { validId },
      NombreDentista: { },
      IdTipoTrabajo: { validId },
      Paciente: { },
      Color: { },
      FechaEntrada: { },
      FechaPrevista: { },
    }
  },
  methods: {
    save: function() {
      this.saveButtonPressed = true
      this.$v.$touch()
      if (!this.$v.$invalid){
        insertWork(this.work, 'labManager.sqlite').then(() => {
          this.work.IdTrabajo = getLastId()
          this.$refs.workIndications.save(this.work.IdTrabajo)
        })
        if(this.adjunctsVisible){
          this.workAdjuncts.IdTrabajo = this.work.IdTrabajo
          insertAdjuntsOfWork(this.workAdjuncts, 'labManager.sqlite')
        }
        this.showModal()
      }
    },
    showModal() {
      this.workIndicationsText = _.map(this.workIndications, 'Descripcion').join('\n')
      this.work.NombreDentista = this.$refs.dentist.query
      this.$refs.modal.show()
    },
    printLabels: function() {
      if (this.$refs.cbResina.checked) this.printLabel('Resina')
      if (this.$refs.cbCompostura.checked) this.printLabel('Compostura')
      if (this.workAdjuncts !== null && this.$refs.cbAditamentos.checked) this.printLabel('Aditamentos')
      if (this.$refs.cbEsqueletico.checked) this.printLabel('Esqueléticos')
      if (this.$refs.cbOrtodoncia.checked) this.printLabel('Ortodoncia')
      if (this.$refs.cbZirconio.checked) this.printLabel('Zirconio')
      if (this.$refs.cbImplantes.checked) this.printLabel('Implantes')
      if (this.$refs.cbEmax.checked) this.printLabel('E-Max')
      if (this.$refs.cbComposite.checked) this.printLabel('Composite')
      if (this.$refs.cbMetalCeramica.checked) this.printLabel('Metal-Cerámica')

      this.hideModal()
    },
    goBack() {
      this.saveButtonPressed = false
      this.work.IdDentista = -1
      this.$refs.dentist.query = ''
      this.work.IdTipoTrabajo = -1
      this.$refs.cbResina.checked = false
      this.$refs.cbCompostura.checked = false
      if (this.adjunctsVisible) this.$refs.cbAditamentos.checked = false
      this.$refs.cbEsqueletico.checked = false
      this.$refs.cbOrtodoncia.checked = false
      this.$refs.cbZirconio.checked = false
      this.$refs.cbImplantes.checked = false
      this.$refs.cbEmax.checked = false
      this.$refs.cbComposite.checked = false
      this.$refs.cbMetalCeramica.checked = false
      this.$router.go(-1)
    },
    setBtnPrintEnabled(){
      this.$refs.btnPrint.disabled = !(
        this.$refs.cbResina.checked || this.$refs.cbCompostura.checked ||
        (this.adjunctsVisible && this.$refs.cbAditamentos.checked) ||
        this.$refs.cbEsqueletico.checked || this.$refs.cbOrtodoncia.checked ||
        this.$refs.cbZirconio.checked ||this.$refs.cbImplantes.checked ||
        this.$refs.cbEmax.checked || this.$refs.cbComposite.checked ||
        this.$refs.cbMetalCeramica.checked
      )
    }
  }
}
</script>
