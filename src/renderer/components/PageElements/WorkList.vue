<template>
<div class="card mb-3">
  <div class="card-header">
    <i class="fas fa-teeth"></i>
    Trabajos</div>
  <div class="card-body">
    <div class="table-responsive">
      <filter-bar></filter-bar>
      <table class="table table-bordered" id="workListTable" width="100%" cellspacing="0">
        <tr>
          <th>Nº trabajo</th>
          <th>Dentista</th>
          <th>Paciente</th>
          <th>Tipo</th>
          <th>Color</th>
          <th>F. Entrada</th>
          <th>F. Prevista</th>
          <th>F. Terminación</th>
          <th>Importe</th>
        </tr>
        <tr v-for="work in getData()" v-bind:key="work.IdTrabajo" v-on:click="showWork(work.IdTrabajo)">
          <td>{{work.IdTrabajo}}</td>
          <td>{{work.NombreDentista}}</td>
          <td>{{work.Paciente}}</td>
          <td>{{work.TipoTrabajo}}</td>
          <td>{{work.Color}}</td>
          <td>{{work.FechaEntrada | formatDateDMY}}</td>
          <td>{{work.FechaPrevista | formatDateDMY}}</td>
          <td>{{work.FechaSalida | formatDateDMY}}</td>
          <td>{{work.Precio}} €</td>
        </tr>
      </table>
    </div>
    <pagination></pagination>
  </div>
</div>
</template>

<script>
import { getWorksList } from '../../../main/dal.js'
import pagination from './table/pagination'
import filterBar from './table/filterBar'
import _ from 'lodash'

const pageSize = 10

export default {
  name: 'worklist',
  components: {
    pagination,
    filterBar
  },
  data () {
    return {
      rawDataset: '',
      filteredDataset: '',
      pageSize: pageSize,
      currentPage: 1
    }
  },
  methods: {
    showWork: function (idWork) {
      this.$parent.$parent.navigateTo('workDetail', idWork)
    },
    // Filter
    applyFilter: function (filter) {
      var lowercaseFilter = filter.toString().toLowerCase()
      if (filter !== '') {
        var a = _.filter(this.rawDataset, function(row){
          if (row.NombreDentista === null) return false
          return row.NombreDentista.toLowerCase().includes(lowercaseFilter)
        })
        var b = _.filter(this.rawDataset, function(row){
          if (row.Paciente === null) return false
          return row.Paciente.toString().toLowerCase().includes(lowercaseFilter)
        })
        var c = _.filter(this.rawDataset, function(row){
          if (row.IdTrabajo === null) return false
          return row.IdTrabajo.toString().toLowerCase().includes(lowercaseFilter)
        })
        var d = _.filter(this.rawDataset, function(row){
          if (row.Color === null) return false
          return row.Color.toString().toLowerCase().includes(lowercaseFilter)
        })
        this.filteredDataset = _.union(a, b, c, d, function(row) { return row.IdTrabajo})
        this.filteredDataset = _.sortBy(this.filteredDataset, function(row) { return row.IdTrabajo})
      } else {
        this.filteredDataset = this.rawDataset
      }
      this.currentPage = 1
    },
    // Pagination
    loadPage: function (page) {
      this.currentPage = page
    },
    getData: function () {
      var arraySize = this.rawDataset.length - 1
      var left = (this.currentPage - 1) * this.pageSize
      var right = (this.currentPage * this.pageSize)
      if (right > arraySize) {
        right = arraySize
      }

      if (left < 0 || left > arraySize)
        return []
      else
        return _.slice(this.filteredDataset, left, right)
    }
    // Filtering

  },
  mounted () {
    getWorksList('labManager.sqlite').then((works) => {
        this.rawDataset = works
        this.filteredDataset = works
      })
  }
}
</script>

<style>
</style>
