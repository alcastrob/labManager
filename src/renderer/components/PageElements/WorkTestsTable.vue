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
        <input type="text" v-model="test.Descripcion" class="inputInTd" @change="trackChanges($event, test.IdPrueba, 'Descripcion')" :id="test.IdPrueba" v-on:focus="showPanel($event)" :disabled="$attrs.disabled === true">
        <div v-if="canShow(test.IdPrueba)" class="list-group myTypeahead" style="position:absolute; left:0px; top: 48px; width: 200px; z-index=1;" >
          <span class="list-group-item clickable" @click="click">Truwa</span>
          <span class="list-group-item clickable" @click="click">Fri</span>
          <span class="list-group-item clickable" @click="click">Cubeta</span>
          <span class="list-group-item clickable" @click="click">Prueba de cliente</span>
          <span class="list-group-item clickable" @click="click">Prueba de estructura</span>
          <span class="list-group-item clickable" @click="click">Prueba de plástico</span>
        </div>
      </td>
      <td class="noMargins">
        <input type="date" class="inputInTd" v-model="test.FechaSalida" @change="trackChanges($event, test.IdPrueba, 'FechaSalida')" @focus="hidePanel" :disabled="$attrs.disabled === true">
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
    <tr v-if="$attrs.disabled !== true">
      <td class="pt-3-half"></td>
      <td class="noMargins">
        <input type="text" class="inputInTd" ref="newDescripcion" id="newDescripcion" v-on:focus="showPanel($event)">
        <div v-if="canShow('newDescripcion')" class="list-group myTypeahead" style="position:absolute; left:0px; top: 48px; width: 200px; z-index=1;" >
          <span class="list-group-item clickable" @click="click">Truwa</span>
          <span class="list-group-item clickable" @click="click">Fri</span>
          <span class="list-group-item clickable" @click="click">Cubeta</span>
          <span class="list-group-item clickable" @click="click">Prueba de cliente</span>
          <span class="list-group-item clickable" @click="click">Prueba de estructura</span>
          <span class="list-group-item clickable" @click="click">Prueba de plástico</span>
        </div>
      </td>
      <td class="noMargins">
        <input type="date" class="inputInTd" ref="newFechaSalida" @focus="hidePanel">
      </td>
      <td class="noMargins">
        <select class="inputInTd" ref="newTurnoSalida">
          <option selected="selected"></option>
          <option v-for="shift in deliveryShifts" v-bind:key="shift.IdTurno" v-bind:value="shift.IdTurno">{{shift.Descripcion}}</option>
        </select>
      </td>
      <td class="noMargins">
        <input type="date" class="inputInTd" ref="newFechaEntrada">
      </td>
      <td class="noMargins">
        <select class="inputInTd" ref="newTurnoEntrada">
          <option selected="selected"></option>
          <option v-for="shift in deliveryShifts" v-bind:key="shift.IdTurno" v-bind:value="shift.IdTurno">{{shift.Descripcion}}</option>
        </select>
      </td>
      <td class="noMargins">
        <input type="text" class="inputInTd" ref="newComentario" @blur="addLastRow()">
      </td>
    </tr>
  </table>
  <!-- <div>
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
    </div> -->
</div> 
</template>

<script>
import tableMixin from './tables/TablesWithEmptyRowsMixin'
import { getDeliveryShifts, insertWorkTest, updateWorkTest, deleteWorkTest } from '../../../main/dal.js'
import { mixin as clickaway } from 'vue-clickaway'
import _ from 'lodash'

export default {
  name: 'workTestsTable',
  mixins: [ clickaway, tableMixin ],
  props: {
    workId: Number
  },
  data () {
    return {
      deliveryShifts: [],
      panels: {}
    }
  },
  methods: {
    // Related with the state and persistence----------------------------------
    addLastRow(){
      if (this.isNotEmpty(this.$refs.newDescripcion.value) || this.isNotEmpty(this.$refs.newComentario.value) || this.isNotEmpty(this.$refs.newFechaSalida.value) || this.isNotEmpty(this.$refs.newFechaEntrada.value) || this.isNotEmpty(this.$refs.newTurnoSalida.value)|| this.isNotEmpty(this.$refs.newTurnoEntrada.value)) {
        var newRow = {
          IdPrueba: this.newIds++,
          IdTrabajo: this.workId,
          Descripcion: this.$refs.newDescripcion.value,
          FechaSalida: this.$refs.newFechaSalida.value,
          IdTurnoFechaSalida: this.$refs.newTurnoSalida.value,
          FechaEntrada: this.$refs.newFechaEntrada.value,
          IdTurnoFechaEntrada: this.$refs.newTurnoEntrada.value,
          Comentario: this.$refs.newComentario.value
        }
        this.data.push(newRow)
        this.insertedRows.push(newRow)
        this.$refs.newDescripcion.value = ''
        this.$refs.newFechaSalida.value = ''
        this.$refs.newTurnoSalida.value = ''
        this.$refs.newFechaEntrada.value = ''
        this.$refs.newTurnoEntrada.value = ''
        this.$refs.newComentario.value = ''
        this.$emit('input', this.tests)
        this.$refs.newDescripcion.focus()
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
        //Just update the inssert with the new value. No more action required.
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
        insertWorkTest(row, 'labManager.sqlite')
      })
      _.forEach(this.deletedRows, function(row){
        deleteWorkTest(row.IdPrueba, 'labManager.sqlite')
      })
      _.forEach(this.updatedRows, function(row){
        updateWorkTest(row, 'labManager.sqlite')
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
    click: function(event) {
      var id = event.currentTarget.parentElement.previousElementSibling.id
      if (id === 'newDescripcion'){
        this.$refs.newDescripcion.value = event.currentTarget.innerText
        this.$refs.newFechaSalida.focus()
      } else {
        id = parseInt(id)
        var element = _.find(this.data, ['IdPrueba', id])
        element.Descripcion = event.currentTarget.innerText
        this.trackChanges({currentTarget: { value: element.Descripcion}}, id, 'Descripcion')
        event.currentTarget.parentElement.parentElement.nextElementSibling.children[0].focus()
      }
      this.hidePanel()
    }
  },
  mounted () {
    // Check the required parameters (props)
    if (this.workId === undefined || this.workId === null)
      throw 'Missing prop workId in WorkTestTable.vue'
    getDeliveryShifts('labManager.sqlite').then((shifts) => {
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

/* The down arrow */
/* input[type="date"]::-webkit-calendar-picker-indicator{
    display: none;
} */

/* select{
  -webkit-appearance: none;
}
select:hover{
  -webkit-appearance: select;
} */
/* table.table-bordered tr:hover select {
  -webkit-appearance: select;
} */

/* select::-webkit-inner-spin-button{
  display: none;
  background-color: blue;
} */



/* input[type="date"]::-webkit-datetime-edit-text{
  color: transparent;
} */
/* input[type="date"]::-webkit-datetime-edit-text:hover{
  color: black;
} */
/* input[type="date"]:hover -webkit-datetime-edit-text{
  color: green;
} */

</style>
