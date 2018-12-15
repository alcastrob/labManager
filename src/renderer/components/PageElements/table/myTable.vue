<template>
  <div class="table-responsive">
    <filter-bar></filter-bar>
    <table class="table table-bordered" id="workListTable" width="100%" cellspacing="0">
      <tr>
        <th v-for="header in headers" v-bind:key="header.dataField"
          v-on:click="sortByExpression(header.dataField)" v-bind:class="header.titleClass">
          {{header.title}}
          <span v-if="currentSortCriteria === header.dataField" class="fas" :class="{'fa-sort-amount-down': currentSortCriteria === header.dataField && currentSortDesc === true,
          'fa-sort-amount-up': currentSortCriteria === header.dataField && currentSortDesc === false}"></span>
        </th>
      </tr>
      <tr v-for="work in getPaginatedData()" v-bind:key="work[0]" v-on:click="navigateToWork(work.IdTrabajo)">
        <template v-for="column in headers">
          <td v-bind:key="column.dataField" v-bind:class="column.rowClass">{{work[column.dataField]}}</td>
        </template>
        <!-- <td>{{work.FechaEntrada | formatDateDMY}}</td>
        <td>{{work.FechaPrevista | formatDateDMY}}</td>
        <td>{{work.FechaSalida | formatDateDMY}}</td> -->
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
      rawDataset: [],
      filteredDataset: '',
      pageSize: pageSize,
      currentPage: 1,
      currentSortCriteria: '',
      currentSortDesc: ''
    }
  },
  props: {
    headers: {
      type: Array,
      required: true
    },
    searchFields: {
      type: Array,
      required: true
    }
  },
  methods: {
    setDataset: function (dataset) {
      this.rawDataset = dataset
      this.applyFilter('') // Just to load all the data
    },
    // Pagination
    loadPage: function (page) {
      this.currentPage = page
    },
    getPaginatedData: function () {
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
      var x = this.currentSortCriteria
      this.filteredDataset = _.sortBy(this.filteredDataset, function(row) {
        return row[x]
        })
      if (!this.currentSortDesc) {
        this.filteredDataset = _.reverse(this.filteredDataset)
      }
    },
    // Filter
    applyFilter: function (searchCriteria) {
      if (searchCriteria !== '' && this.searchFields.length > 0) {
        var lowercaseFilter = searchCriteria.toString().toLowerCase()
        this.filteredDataset = []
        for (var i=0; i != this.searchFields.length; i++){
          var currentSearchField = this.searchFields[i]
          var subset = _.filter(this.rawDataset, function(row){
            if (row[currentSearchField] === null) return false
            return row[currentSearchField].toString().toLowerCase().includes(lowercaseFilter)
          })
          this.filteredDataset = _.union(this.filteredDataset, subset, function(row) {
            return row.IdTrabajo})
        }
        this.sortBy()
      } else {
        this.filteredDataset = this.rawDataset
      }
      this.currentPage = 1
    }
  },
  mounted () {
    this.currentSortCriteria = this.searchFields[0]
    this.currentSortDesc = true
  }
}
</script>
