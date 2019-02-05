<template>
<div id="productsTable" class="table-editable">
  <div>
    <filterBar ref="filterBar"></filterBar>
    <table class="table table-bordered table-responsive-xs table-striped" >
      <thead>
        <tr>
          <th style="width: 4%;"></th>
          <th class="text-left" style="width: 96%;">Descripción</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in getPaginatedData()" :key="product.IdProductoLote">
          <td class="pt-3-half">
            <i class="fa fa-times-circle" v-on:click="deleteRow(product.IdProductoLote)"></i>
          </td>
          <td class="noMargins">
            <input type="text" v-model="product.Descripcion" class="inputInTd" @change="trackChanges($event, product.IdProductoLote, 'Descripcion')" @keyup.enter="trackChanges($event, product.IdProductoLote, 'Descripcion')" ref="newDescripcion">
          </td>
        </tr>
        <!-- the blank line -->
        <tr v-if="$attrs.disabled !== true">
          <td class="pt-3-half"></td>
          <td class="noMargins">
            <input type="text" class="inputInTd" v-model="$v.newRow.descripcion.$model" @blur="addLastRow()" @keyup.enter="addLastRow()" :class="{'bg-danger text-white animated flash': $v.newRow.descripcion.$error}">
          </td>
        </tr>
      </tbody>
    </table>
    <pagination></pagination>
    <!-- <div>
      <h3>Inserted</h3>
      <ul v-for="inserted in insertedRows" :key="inserted.IdProductoLote">
        <li>{{inserted.IdProductoLote}}|{{inserted.Descripcion}}|{{inserted.Precio}}</li>
      </ul>
      <h3>Updated</h3>
      <ul v-for="updated in updatedRows" :key="updated.IdProductoLote">
        <li>{{updated.IdProductoLote}}|{{updated.Descripcion}}|{{updated.Precio}}</li>
      </ul>
      <h3>Deleted</h3>
      <ul v-for="deleted in deletedRows" :key="deleted.IdProductoLote">
        <li>{{deleted.IdProductoLote}}|{{deleted.Descripcion}}|{{deleted.Precio}}</li>
      </ul>
    </div> -->
  </div>
</div>
</template>

<script>
import tablesWithEmptyRowMixin from './tablesWithEmptyRowsMixin'
import { getProductList, insertProduct, updateProduct, deleteProduct } from '../../../../main/dal.js'
import euroInput from '../tables/euroInput'
import filterBar from '../tables/filterBar'
import pagination from '../tables/pagination'
import _ from 'lodash'
import moment from 'moment'
import { required } from 'vuelidate/lib/validators'


const PAGESIZE = 10

export default {
  name: 'productsTable',
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
      newRow: {
        descripcion: ''
      }
    }
  },
  validations: {
    newRow: {
      descripcion: {
        required
      }
    }
  },
  methods: {
    // Related with the state and persistence----------------------------------
    addLastRow(){
      if (this.$v.newRow.$anyDirty){
        this.$v.newRow.$touch()
        var _newRow = {
          IdProductoLote: this.newIds++,
          Descripcion: this.newRow.descripcion
        }
        this.data.push(_newRow)
        this.insertedRows.push(_newRow)
        this.$refs.newDescripcion.value = ''
        this.save()
        this.$emit('input', this.data)
        this.$refs.newDescripcion.focus()
      }
    },
    deleteRow: function (rowId) {
      this.data = _.remove(this.data, function (n) {
        return n.IdProductoLote !== rowId
      })
      if (_.some(this.insertedRows, ['IdProductoLote', rowId])){
        _.remove(this.insertedRows, ['IdProductoLote', rowId])
      } else if (_.some(this.updatedRows, ['IdProductoLote', rowId])){
        _.remove(this.updatedRows, ['IdProductoLote', rowId])
        this.deletedRows.push({IdProductoLote: rowId})
      } else {
        this.deletedRows.push({IdProductoLote: rowId})
      }
      this.save()
      this.$emit('input', this.rawDataset)
    },
    trackChanges(event, rowId, field) {

      //Let's start looking if the changed row is already on the inserted list
      var temp = _.find(this.insertedRows, ['IdProductoLote', rowId])
      if (this.isNotEmpty(temp)){
        //Just update the insert with the new value. No more action required.
        temp[field] = event.currentTarget.value
      } else {
        //OK, so we have to update. But maybe this field was already updated. Let's check.
        temp = _.find(this.updatedRows, ['IdProductoLote', rowId])
        if (this.isNotEmpty(temp)){
          //The row was already updated. Make a cumulative update
          var original = _.find(this.rawDataset, ['IdProductoLote', rowId])
          temp[field] = event.currentTarget.value
        } else {
          //First time updated. So jot it down.
          var original = _.find(this.rawDataset, ['IdProductoLote', rowId])
          original[field] = event.currentTarget.value
          this.updatedRows.push(original)
        }
      }
      this.save()
      this.$emit('input', this.rawDataset)
    },
    save(){
      _.forEach(this.insertedRows, function(row){
        insertProduct(row)
      })
      _.forEach(this.deletedRows, function(row){
        deleteProduct(row)
      })
      _.forEach(this.updatedRows, function(row){
        updateProduct(row)
      })
      this.insertedRows = []
      this.deletedRows = []
      this.updatedRows = []

      this.getData()
      this.$refs.filterBar.doFilter()
    },
    // Other methods (specific)------------------------------------------------
    applyTextFilter: async function(text){
      this.filteredDataset = await getProductList(text)
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
    focus: function() {
      document.getElementById('productsTable').focus()
    },
    cleanComponent() {
      this.newIds = 10000000
      this.insertedRows = []
      this.deletedRows = []
      this.updatedRows = []
    },
    isError() {
      return document.getElementsByClassName('bg-danger').length > 0
    },
    getData: async function(){
      this.rawDataset = await getProductList()
      this.filteredDataset = this.rawDataset
    },
  },
  mounted () {
    this.getData()
    this.$root.$on('topbar:save', this.save)
  }
}
</script>