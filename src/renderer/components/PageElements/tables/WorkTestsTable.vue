<template>
<div id="table" class="table-editable">
  <table class="table table-bordered table-responsive-xs table-striped" v-on-clickaway="hidePanel">
    <tr>
      <th style="width: 4%"></th>
      <th class="text-left" style="width: 13%;">Prueba</th>
      <th class="text-left" style="width: 14%;">F. salida</th>
      <th class="text-left" style="width: 13%;">Reparto salida</th>
      <th class="text-left" style="width: 14%;">F. entrada</th>
      <th class="text-left" style="width: 13%;">Reparto entrada</th>
      <th class="text-left" style="width: 29%;">Comentario</th>
    </tr>
    <tr v-for="test in data" v-bind:key="test.IdPrueba">
      <td class="pt-3-half" @focus="hidePanel">
        <i class="fa fa-times-circle" v-on:click="deleteRow(test.IdPrueba)" v-if="$attrs.disabled !== true"></i>
      </td>
      <td class="noMargins">
        <input type="text" v-model="test.Descripcion" class="inputInTd" @change="trackChanges($event, test.IdPrueba, 'Descripcion')" @blur="changeDescription($event)" :id="test.IdPrueba" v-on:focus="showPanel($event)" :disabled="$attrs.disabled === true">
        <div v-if="canShow(test.IdPrueba)" class="list-group myTypeahead" style="position:absolute; left:0px; top: 48px; width: 200px; z-index=1;" >
          <span class="list-group-item clickable" @click="selectTestDescription">Truwa</span>
          <span class="list-group-item clickable" @click="selectTestDescription">Fri</span>
          <span class="list-group-item clickable" @click="selectTestDescription">Cubeta</span>
          <span class="list-group-item clickable" @click="selectTestDescription">Prueba de cliente</span>
          <span class="list-group-item clickable" @click="selectTestDescription">Prueba de estructura</span>
          <span class="list-group-item clickable" @click="selectTestDescription">Prueba de plástico</span>
        </div>
      </td>
      <td class="noMargins">
        <input type="date" class="inputInTd" v-model="test.FechaSalida" @blur="changedDate($event)" @change="trackChanges($event, test.IdPrueba, 'FechaSalida')" @focus="hidePanel" :disabled="$attrs.disabled === true">
      </td>
      <td class="noMargins">
        <select class="inputInTd" v-model="test.IdTurnoFechaSalida"  @change="trackChanges($event, test.IdPrueba, 'IdTurnoFechaSalida')" @focus="hidePanel" :disabled="$attrs.disabled === true">
          <option value=""></option>
          <option v-for="shift in deliveryShifts" v-bind:key="shift.IdTurno" v-bind:value="shift.IdTurno">{{shift.Descripcion}}</option>
        </select>
      </td>
      <td class="noMargins">
        <input type="date" class="inputInTd" v-model="test.FechaEntrada" @change="trackChanges($event, test.IdPrueba, 'FechaEntrada')" @focus="hidePanel" :disabled="$attrs.disabled === true">
      </td>
      <td class="noMargins">
        <select class="inputInTd" v-model="test.IdTurnoFechaEntrada" @change="trackChanges($event, test.IdPrueba, 'IdTurnoFechaEntrada')" @focus="hidePanel" :disabled="$attrs.disabled === true">
          <option value=""></option>
          <option v-for="shift in deliveryShifts" v-bind:key="shift.IdTurno" v-bind:value="shift.IdTurno">{{shift.Descripcion}}</option>
        </select>
      </td>
      <td class="noMargins">
        <input type="text" v-model="test.Comentario" class="inputInTd" @change="trackChanges($event, test.IdPrueba, 'Comentario')" @focus="hidePanel" :disabled="$attrs.disabled === true">
      </td>
    </tr>
    <!-- The empty row for new values -->
    <tr v-if="$attrs.disabled !== true">
      <td class="pt-3-half"></td>
      <td class="noMargins">
        <input type="text" class="inputInTd" ref="newDescripcion" v-model="$v.newRow.descripcion.$model" id="newDescripcion" @focus="showPanel($event)" :class="{'bg-danger text-white animated flash': $v.newRow.descripcion.$anyError}">
        <div v-if="canShow('newDescripcion')" class="list-group myTypeahead" style="position:absolute; left:0px; top: 48px; width: 200px; z-index=1;" >
          <span class="list-group-item clickable" @click="selectTestDescription">Truwa</span>
          <span class="list-group-item clickable" @click="selectTestDescription">Fri</span>
          <span class="list-group-item clickable" @click="selectTestDescription">Cubeta</span>
          <span class="list-group-item clickable" @click="selectTestDescription">Prueba de cliente</span>
          <span class="list-group-item clickable" @click="selectTestDescription">Prueba de estructura</span>
          <span class="list-group-item clickable" @click="selectTestDescription">Prueba de plástico</span>
        </div>
      </td>
      <td class="noMargins">
        <input type="date" class="inputInTd" ref="newFechaSalida" id="newFechaSalida" @focus="hidePanel" @blur="updateIfDateIsValid($event, isInvalidNewOutDate)" @input="updateIfDateIsValid($event, isInvalidNewOutDate)" v-model="$v.newRow.fechaSalida.$model" :class="{'bg-danger text-white animated flash': isInvalidNewOutDate}">
      </td>
      <td class="noMargins">
        <select class="inputInTd" ref="newTurnoSalida" v-model="$v.newRow.idTurnoFechaSalida.$model">
          <option selected="selected"></option>
          <option v-for="shift in deliveryShifts" v-bind:key="shift.IdTurno" v-bind:value="shift.IdTurno">{{shift.Descripcion}}</option>
        </select>
      </td>
      <td class="noMargins">
        <input type="date" class="inputInTd" id="newFechaEntrada" v-model="$v.newRow.fechaEntrada.$model" @blur="updateIfDateIsValid($event, isInvalidNewInDate)" @input="updateIfDateIsValid($event, isInvalidNewInDate)" :class="{'bg-danger text-white animated flash': isInvalidNewInDate}">
      </td>
      <td class="noMargins">
        <select class="inputInTd" ref="newTurnoEntrada" v-model="$v.newRow.idTurnoFechaEntrada.$model">
          <option selected="selected"></option>
          <option v-for="shift in deliveryShifts" v-bind:key="shift.IdTurno" v-bind:value="shift.IdTurno">{{shift.Descripcion}}</option>
        </select>
      </td>
      <td class="noMargins">
        <input type="text" class="inputInTd" v-model="$v.newRow.comentario.$model" :class="{'bg-danger text-white animated flash': $v.newRow.comentario.$error && !allRowEmpty}" @blur="addLastRow()">
      </td>
    </tr>
  </table>
  newRow: {{$v.newRow.$anyDirty}}<br>
  wholeTable: {{isDirty()}}<br>
  isError: {{isError()}}
  <div>
      <h3>Inserted</h3>
      <ul v-for="inserted in insertedRows" :key="inserted.IdPrueba">
        <li>{{inserted.IdPrueba}}|{{inserted.Descripcion}}</li>
      </ul>
      <h3>Updated</h3>
      <ul v-for="updated in updatedRows" :key="updated.IdPrueba">
        <li>{{updated.IdPrueba}}|{{updated.Descripcion}}</li>
      </ul>
      <h3>Deleted</h3>
      <ul v-for="deleted in deletedRows" :key="deleted.IdPrueba">
        <li>{{deleted.IdPrueba}}|{{deleted.Descripcion}}</li>
      </ul>
    </div>
</div>
</template>

<script>
import tablesWithEmptyRowMixin from './tablesWithEmptyRowsMixin'
import { getDeliveryShifts, insertWorkTest, updateWorkTest, deleteWorkTest } from '../../../../main/dal.js'
import { mixin as clickaway } from 'vue-clickaway'
import { minLength, required } from 'vuelidate/lib/validators'
import _ from 'lodash'

export default {
  name: 'workTestsTable',
  mixins: [ clickaway, tablesWithEmptyRowMixin ],
  props: {
    workId: Number
  },
  data () {
    return {
      deliveryShifts: [],
      panels: {},
      newRow: {
        descripcion: '',
        fechaSalida: '',
        idTurnoFechaSalida: '',
        fechaEntrada: '',
        idTurnoFechaEntrada: '',
        comentario: ''
      },
      isInvalidNewInDate: false,
      isInvalidNewOutDate: false
    }
  },
  validations: {
    newRow: {
      descripcion: { required },
      fechaSalida: {},
      idTurnoFechaSalida: {},
      fechaEntrada: {},
      idTurnoFechaEntrada: {},
      comentario: {}
    }
  },
  methods: {
    // Related with the state and persistence----------------------------------
    addLastRow(){
      debugger
      if(this.allRowEmpty){
        this.$v.newRow.$reset()
      } else if (this.$v.newRow.$anyDirty){
        this.$v.newRow.$touch()
        if (!this.$v.newRow.$anyError) {
          var newRow = {
            IdPrueba: this.newIds++,
            IdTrabajo: this.workId,
            Descripcion: this.$v.newRow.descripcion.$model,
            FechaSalida: this.$v.newRow.fechaSalida.$model,
            IdTurnoFechaSalida: this.$refs.newTurnoSalida.value,
            FechaEntrada: this.$v.newRow.fechaEntrada.$model,
            IdTurnoFechaEntrada: this.$refs.newTurnoEntrada.value,
            Comentario: this.$v.newRow.comentario.$model
          }
          this.data.push(newRow)
          this.insertedRows.push(newRow)
          this.$v.newRow.descripcion.$model = ''
          this.$v.newRow.fechaSalida.$model = ''

          this.$refs.newTurnoSalida.value = ''
          this.$v.newRow.fechaEntrada.$model = ''
          this.$refs.newTurnoEntrada.value = ''
          this.$v.newRow.comentario.$model = ''
          this.$v.newRow.$reset()
          this.$emit('input', this.tests)
          this.$refs.newDescripcion.focus()
        }
      }
    },
    deleteRow: function (rowId) {
      this.data = _.remove(this.data, function (n) {
        return n.IdPrueba !== rowId
      })
      this.$emit('input', this.data)
      if (_.some(this.insertedRows, ['IdPrueba', rowId])){
        _.remove(this.insertedRows, ['IdPrueba', rowId])
      } else if (_.some(this.updatedRows, ['IdPrueba', rowId])){
        _.remove(this.updatedRows, ['IdPrueba', rowId])
        this.deletedRows.push({IdPrueba: rowId})
      } else {
        this.deletedRows.push({IdPrueba: rowId})
      }
    },
    trackChanges(event, rowId, field) {
      //Let's start looking if the changed row is already on the inserted list
      var temp = _.find(this.insertedRows, ['IdPrueba', rowId])
      if (this.isNotEmpty(temp)){
        //Just update the insert with the new value. No more action required.
        temp[field] = event.currentTarget.value
      } else {
        //OK, so we have to update. But maybe this field was already updated. Let's check.
        temp = _.find(this.updatedRows, ['IdPrueba', rowId])
        if (this.isNotEmpty(temp)){
          //The row was already updated. Make a cumulative update
          var original = _.find(this.data, ['IdPrueba', rowId])
          temp.IdTrabajo = original.IdTrabajo
          temp.Descripcion = original.Descripcion
          temp.FechaSalida = original.FechaSalida
          temp.IdTurnoFechaSalida = original.IdTurnoFechaSalida
          temp.FechaEntrada = original.FechaEntrada
          temp.IdTurnoFechaEntrada = original.IdTurnoFechaEntrada
        } else {
          //First time updated. So jot it down.
          var original = _.find(this.data, ['IdPrueba', rowId])
          this.updatedRows.push(original)
        }
      }
      this.$emit('input', this.data)
    },
    save(masterId){
      _.forEach(this.insertedRows, function(row){
        row.IdTrabajo = masterId
        insertWorkTest(row)
      })
      _.forEach(this.deletedRows, function(row){
        deleteWorkTest(row.IdPrueba)
      })
      _.forEach(this.updatedRows, function(row){
        updateWorkTest(row)
      })
      this.insertedRows = []
      this.deletedRows = []
      this.updatedRows = []
    },
    showPanel: function(event) {
      _.forEach(Object.keys(this.panels), (panelId) => {
        this.panels[panelId] = false
      })
      this.panels[event.currentTarget.id] = true
      this.$forceUpdate()
    },
    hidePanel: function(id) {
      if (id === undefined || id.type === undefined) {
        this.panels[id] = false
      } else {
      _.forEach(Object.keys(this.panels), (panelId) => {
        this.panels[panelId] = false
      })
      }
      this.$forceUpdate()
    },
    canShow: function(id) {
      return this.panels[id]
     },
    selectTestDescription: function(event) {
      var id = event.currentTarget.parentElement.previousElementSibling.id
      if (id === 'newDescripcion'){
        this.$v.newRow.descripcion.$model = event.currentTarget.innerText
        this.$refs.newFechaSalida.focus()
      } else {
        id = parseInt(id)
        var element = _.find(this.data, ['IdPrueba', id])
        element.Descripcion = event.currentTarget.innerText
        this.trackChanges({currentTarget: { value: element.Descripcion}}, id, 'Descripcion')
        event.currentTarget.parentElement.parentElement.nextElementSibling.children[0].focus()
      }
      this.hidePanel()
    },
    changeDescription: function(event){
      var element = event.currentTarget
      this.toggleValidation(element, element.value.length > 0)
    },
    changedDate: function(event){
      var element = event.currentTarget
      this.toggleValidation(element, element.validity.valid)
    },
    updateIfDateIsValid(event){
      //Unfortunatelly, this check cannot be done on the :class of the input element, because the state must be updated on the @blur and the @input events. That's the reason to put appart the "invalid" state into a var.

      if (event.currentTarget.id === 'newFechaSalida') {
        this.isInvalidNewOutDate = !event.currentTarget.validity.valid
      } else {
        this.isInvalidNewInDate = !event.currentTarget.validity.valid
      }
     },
    toggleValidation(element, isValid){
      if (!isValid){
        element.classList.add('bg-danger')
        element.classList.add('text-white')
        element.classList.add('animated')
        element.classList.add('flash')
      } else {
        element.classList.remove('bg-danger')
        element.classList.remove('text-white')
        element.classList.remove('animated')
        element.classList.remove('flash')
      }
    },
    isError: function() {
      return document.getElementsByClassName('bg-danger').length > 0
    }
  },
  computed: {
    allRowEmpty: function() {
      return this.$v.newRow.descripcion.$model.length === 0 && this.$v.newRow.fechaSalida.$model.length === 0 && this.$v.newRow.idTurnoFechaSalida.$model === '' && this.$v.newRow.fechaEntrada.$model.length === 0 && this.$v.newRow.idTurnoFechaEntrada.$model === '' && this.$v.newRow.comentario.$model.length === 0
    }
  },
  mounted () {
    // Check the required parameters (props)
    if (this.workId === undefined || this.workId === null)
      throw 'Missing prop workId in workTestsTable.vue'
    getDeliveryShifts().then((shifts) => {
      this.deliveryShifts = shifts
    })
  }
}
</script>

<style>
.pt-3-half {
    padding-top: 1.4rem;
}
input[type="date"]::-webkit-inner-spin-button{
    display: none;
}
</style>
