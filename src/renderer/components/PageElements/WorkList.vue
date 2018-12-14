<template>
<div class="card mb-3">
  <div class="card-header">
    <i class="fas fa-teeth"></i>
    Trabajos</div>
  <div class="card-body">
    <div class="table-responsive">
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
import _ from 'lodash'

const pageSize = 10

export default {
  name: 'worklist',
  components: {
    pagination
  },
  data () {
    return {
      dataset: '',
      pageSize: pageSize,
      currentPage: 1
    }
  },
  methods: {
    showWork: function (idWork) {
      this.$parent.$parent.navigateTo('workDetail', idWork)
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
        return _.slice(this.dataset, left, right)
    }
  },
  mounted () {
    getWorksList('labManager.sqlite').then((works) => {
      this.dataset = works
    })
  }
}
</script>

<style>
</style>
