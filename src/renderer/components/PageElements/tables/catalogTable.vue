<template>
<div id="table" class="table-editable">
  <div>
    <filterBar></filterBar>
    <table class="table table-bordered table-responsive-xs table-striped" >
      <thead>
        <tr>
          <th style="width: 4%;"></th>
          <th class="text-left" style="width: 50%;">Descripción</th>
          <th class="text-right" style="">Precio</th>
          <th style="width: 16%;" class="text-right">Desde</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="indication in getPaginatedData()" :key="indication.IdElementoCatalogo">
          <td class="pt-3-half">
            <i class="fa fa-times-circle" v-on:click="deleteRow(indication.IdElementoCatalogo)" v-if="$attrs.disabled !== true"></i>
          </td>
          <td class="noMargins">
            <input type="text" v-model="indication.Descripcion" class="inputInTd" @change="trackChanges($event, indication.IdElementoCatalogo, 'Descripcion')" :disabled="$attrs.disabled === true">
          </td>
          <td class="noMargins">
            <euroInput class="inputInTd text-right" @blur="updatePrice($event, indication.IdElementoCatalogo)" v-model="indication.Precio" @change="trackChanges($event, indication.IdElementoCatalogo, 'Precio')"></euroInput>
          </td>
          <td class="noMargins">
            <input type="text" class="inputInTd text-right" :value="format(indication.FechaInicio)" disabled>
          </td>
        </tr>
        <!-- the blanck line -->
        <tr v-if="$attrs.disabled !== true">
          <td class="pt-3-half"></td>
          <td class="noMargins">
            <input type="text" class="inputInTd" ref="newDescripcion">
          </td>
          <td class="noMargins" >
            <input type="text" class="inputInTd text-right" ref="newPrecio" @blur="addLastRow()" v-on:keydown="filterJustNumberKeystrokes">
          </td>
          <td class="noMargins">
            <input type="text" class="inputInTd" disabled>
          </td>
        </tr>
      </tbody>
    </table>
    <pagination></pagination>
    <!-- <div>
      <h3>Inserted</h3>
      <ul v-for="inserted in insertedRows" :key="inserted.IdElementoCatalogo">
        <li>{{inserted.IdElementoCatalogo}}|{{inserted.Descripcion}}|{{inserted.Precio}}</li>
      </ul>
      <h3>Updated</h3>
      <ul v-for="updated in updatedRows" :key="updated.IdElementoCatalogo">
        <li>{{updated.IdElementoCatalogo}}|{{updated.Descripcion}}|{{updated.Precio}}</li>
      </ul>
      <h3>Deleted</h3>
      <ul v-for="deleted in deletedRows" :key="deleted.IdElementoCatalogo">
        <li>{{deleted.IdElementoCatalogo}}|{{deleted.Descripcion}}|{{deleted.Precio}}</li>
      </ul>
    </div> -->
  </div>
</div>
</template>

<script>
import tablesWithEmptyRowMixin from './TablesWithEmptyRowsMixin'
// import tableMixin from './tableMixin'
import { getCatalogList, insertCatalogEntry, updateCatalogEntry, deleteCatalogEntry } from '../../../../main/dal.js'
import euroInput from '../tables/euroInput'
import filterBar from '../tables/filterBar'
import pagination from '../tables/pagination'
import _ from 'lodash'
import moment from 'moment'

const PAGESIZE = 10

export default {
  name: 'catalogTable',
  mixins: [tablesWithEmptyRowMixin],
  components: {
    euroInput,
    pagination,
    filterBar
  },
  data () {
    return {
      rawDataset: [],
      filteredDataset: [],
      pageSize: PAGESIZE,
      currentPage: 1,
    }
  },
  methods: {
    // Related with the state and persistence----------------------------------
    addLastRow(){
      if (this.isNotEmpty(this.$refs.newDescripcion.value) || this.isNotEmpty(this.$refs.newPrecio.value)) {
        var newRow = {
          IdElementoCatalogo: this.newIds++,
          Descripcion: this.$refs.newDescripcion.value,
          Precio: this.$refs.newPrecio.value
          }
        this.data.push(newRow)
        this.insertedRows.push(newRow)
        this.$refs.newDescripcion.value = ''
        this.$refs.newPrecio.value = ''
        this.$emit('input', this.data)
        this.$refs.newDescripcion.focus()
      }
    },
    deleteRow: function (rowId) {
      this.data = _.remove(this.data, function (n) {
        return n.IdElementoCatalogo !== rowId
      })
      this.$emit('input', this.data)
      if (_.some(this.insertedRows, ['IdElementoCatalogo', rowId])){
        _.remove(this.insertedRows, ['IdElementoCatalogo', rowId])
      } else if (_.some(this.updatedRows, ['IdElementoCatalogo', rowId])){
        _.remove(this.updatedRows, ['IdElementoCatalogo', rowId])
        this.deletedRows.push({IdElementoCatalogo: rowId})
      } else {
        this.deletedRows.push({IdElementoCatalogo: rowId})
      }
    },
    trackChanges(event, rowId, field) {
      //Let's start looking if the changed row is already on the inserted list
      var temp = _.find(this.insertedRows, ['IdElementoCatalogo', rowId])
      if (this.isNotEmpty(temp)){
        //Just update the inssert with the new value. No more action required.
        temp[field] = event.currentTarget.value
      } else {
        //OK, so we have to update. But maybe this field was already updated. Let's check.
        temp = _.find(this.updatedRows, ['IdElementoCatalogo', rowId])
        if (this.isNotEmpty(temp)){
          //The row was already updated. Make a cumulative update
          var original = _.find(this.data, ['IdElementoCatalogo', rowId])
          temp.Precio = original.Precio
          temp.Descripcion = original.Descripcion
        } else {
          //First time updated. So jot it down.
          var original = _.find(this.data, ['IdElementoCatalogo', rowId])
          this.updatedRows.push(original)
        }
      }
      this.$emit('input', this.data)
    },
    save(){
      _.forEach(this.insertedRows, function(row){
        // row.IdElementoCatalogo = masterId
        insertCatalogEntry(row)
      })
      _.forEach(this.deletedRows, function(row){
        deleteCatalogEntry(row)
      })
      _.forEach(this.updatedRows, function(row){
        updateCatalogEntry(row)
      })
      this.insertedRows = []
      this.deletedRows = []
      this.updatedRows = []
    },
    // Other methods (specific)------------------------------------------------
    updatePrice(event, id) {
      var elementInArray = _.find(this.data, ['IdElementoCatalogo', id])
      if (this.isEmpty(event.srcElement.value)) {
        elementInArray.Precio = 0
      } else {
        elementInArray.Precio =  event.srcElement.value
      }
      this.$emit('input', this.data)
    },
    filterJustNumberKeystrokes(event){
      if (!(event.key === '0' || event.key === '1' || event.key === '2' ||
        event.key === '3' || event.key === '4' || event.key === '5' ||
        event.key === '6' || event.key === '7' || event.key === '8' ||
        event.key === '9' || event.key === '.' || event.key === 'ArrowLeft' ||
        event.key === 'ArrowRight' || event.key === 'Home' || event.key === 'End' ||
        event.key === '-' || (event.key === 'c' && event.ctrlKey === true) ||
        event.key === 'Delete' || (event.key === 'v' && event.ctrlKey === true) ||
        event.key === 'Backspace' || event.key === 'Tab' || event.key === 'Enter'
      ))
        event.preventDefault()
    },
    format(date) {
      return moment(date).format('DD/MM/YYYY')
    },
    applyTextFilter: async function(text){
      this.filteredDataset = await getCatalogList(text)
    },
    getPaginatedData: function () {
      if (this.rawDataset.length === 0){
        return []
      }

      var arraySize = this.rawDataset.length - 1
      var left = (this.currentPage - 1) * this.pageSize
      var right = (this.currentPage * this.pageSize)
      if (right > arraySize) {
        right = arraySize + 1
      }

      if (left < 0 || left > arraySize)
        return []
      else {
        return _.slice(this.filteredDataset, left, right)
      }
    },
    getData: async function(){
      this.rawDataset = await getCatalogList()
      this.filteredDataset = this.rawDataset
    },
  },
  mounted () {
    this.getData()
  }
}
</script>