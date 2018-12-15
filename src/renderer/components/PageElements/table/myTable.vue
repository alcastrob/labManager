<template>
  <div class="table-responsive">
    <filter-bar></filter-bar>
    <table class="table table-bordered" id="workListTable" width="100%" cellspacing="0">
      <tr>
        <th v-for="header in headers" v-bind:key="header.sortExpression"
          v-on:click="sortByExpression(header.sortExpression)">
          {{header.title}}
          <span class="fas" :class="{'fa-sort-amount-down': currentSortCriteria === header.sortExpression && currentSortDesc === true,
          'fa-sort-amount-up': currentSortCriteria === header.sortExpression && currentSortDesc === false}"></span>
        </th>
      </tr>
      <tr v-for="work in getData()" v-bind:key="work.IdTrabajo" v-on:click="navigateToWork(work.IdTrabajo)">
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
    <pagination></pagination>
  </div>
</template>

<script>
import pagination from './pagination'
import filterBar from './filterBar'
import _ from 'lodash'

const pageSize = 10

export default {
  name: 'myTable',
  components: {
    pagination,
    filterBar
  },
  data () {
    return {
      rawDataset: '',
      filteredDataset: '',
      pageSize: pageSize,
      currentPage: 1,
    }
  },
  props: {
    headers: {
      type: Array,
      required: true
    }
  },
  methods: {
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
    },
    // Sorting
    sortByExpression: function(expression) {
      if (expression === this.currentSortCriteria) {
        this.currentSortDesc = !this.currentSortDesc
      } else {
        this.currentSortCriteria = expression
        this.currentSortDesc = true
      }
      this.sortBy()
    },
    sortBy: function() {
      console.log(this.filteredDataset)
      var x = this.currentSortCriteria
      this.filteredDataset = _.sortBy(this.filteredDataset, function(row) {
        return row[x]
        })
      if (!this.currentSortDesc) {
        this.filteredDataset = _.reverse(this.filteredDataset)
      }
    }
  }
}
</script>
