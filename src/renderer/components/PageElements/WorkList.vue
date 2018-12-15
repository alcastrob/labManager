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
      dataset: '',
      dataset2: '',
      pageSize: pageSize,
      currentPage: 1
    }
  },
  methods: {
    showWork: function (idWork) {
      this.$parent.$parent.navigateTo('workDetail', idWork)
    },
    initializeDataset: function () {
      getWorksList('labManager.sqlite').then((works) => {
        this.dataset = works
        this.dataset2 = works
      })
    },
    // Filter
    applyFilter: function (filter) {
      // var tempDataset
      // getWorksList('labManager.sqlite').then((works) => {
      //   tempDataset = works
      // })

      console.log(this.dataset)
      if (filter !== '') {
        // this.dataset2 = _.filter(this.dataset, {NombreDentista: filter})
        // console.log(this.dataset2)
        this.dataset2 = _.filter(this.dataset, function(row){
          if (row.NombreDentista === null) return false
          return row.NombreDentista.toLowerCase().includes(filter.toLowerCase())
          // return row.NombreDentista === filter
        })
        // console.log(tempDataset)
        // this.dataset = tempDataset
      } else {
        this.dataset2 = this.dataset
      }
    },
    // Pagination
    loadPage: function (page) {
      this.currentPage = page
    },
    getData: function () {
      var arraySize = this.dataset.length - 1
      var left = (this.currentPage - 1) * this.pageSize
      var right = (this.currentPage * this.pageSize)
      if (right > arraySize) {
        right = arraySize
      }

      if (left < 0 || left > arraySize)
        return []
      else
        return _.slice(this.dataset2, left, right)
    }
    // Filtering

  },
  mounted () {
    // getWorksList('labManager.sqlite').then((works) => {
    //   this.dataset = works
    // })
    this.initializeDataset()
  }
}
</script>

<style>
</style>
