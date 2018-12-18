<template>
  <div class="table-responsive">
    <filter-bar></filter-bar>
    <table class="table table-bordered" width="100%" cellspacing="0">
      <tr>
        <th v-for="header in headers" v-bind:key="header.dataField"
          v-on:click="sortByExpression(header.dataField)" v-bind:class="header.titleClass">
          {{header.title}}
          <span v-if="currentSortCriteria === header.dataField" class="fas" :class="{'fa-sort-amount-down': currentSortCriteria === header.dataField && currentSortDesc === true,
          'fa-sort-amount-up': currentSortCriteria === header.dataField && currentSortDesc === false}"></span>
        </th>
      </tr>
      <tr v-for="row in getPaginatedData()" v-bind:key="row[0]" v-on:click="clickOn(row['Key'])">
        <template v-for="column in headers">
          <td v-bind:key="column.dataField" v-bind:class="column.rowClass">{{formatRow(row[column.dataField], column.formatter)}}</td>
        </template>
      </tr>
    </table>
    <pagination></pagination>
  </div>
</template>

<script>
import pagination from './pagination'
import filterBar from './filterBar'
import moment from 'moment'
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
      currentSortDesc: '',
      currentSeachCriteria: '',
      state: null,
      moneyFormatter: new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'EUR'
      })
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
    },
    eventId: {
      type: String,
      required: true
    }
  },
  methods: {
    formatRow(row, formatter) {
      if(formatter === 'date' && row !== null && row !== undefined) {
        return moment(row).format('DD/MM/YYYY')
      } else if(formatter === 'money' && row !== null && row !== undefined) {
        return this.moneyFormatter.format(row)
      } else {
      return row
      }
    },
    setDataset: function (dataset) {
      this.rawDataset = dataset
      //Let's check if the dataset contains the required Key column
      if (_.some(dataset, ['Key', undefined])) {
        throw 'Missing Key column in passed dataset in MyTable.vue'
      }

      if (this.state !== null){
        // TODO: set the values here (more or less)
      }

      this.applyFilter('') // Just to load all the data
    },
    clickOn: function(index) {
      // This method must pass the state of the table to the destination component just for the "Back" functionality
      var data = {
        index: index,
        filter: this.currentSeachCriteria,
        sortCriteria: this.currentSortCriteria,
        sortDirection: this.currentSortDesc,
        currentPage: this.currentPage,
        component: this.eventId}
      this.$root.$emit('table:click:' + this.eventId, data)
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
        this.currentSeachCriteria = searchCriteria
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
    },
  },
  mounted () {
    // Check the required parameters (props)
    if (this.headers === undefined || this.headers === null)
      throw 'Missing prop headers in myTable.vue'
    if (this.searchFields === undefined || this.searchFields === null)
      throw 'Missing prop searchFields in myTable.vue'
    if (this.eventId === undefined || this.eventId === null)
      throw 'Missing prop eventId in myTable.vue'



    this.currentSortCriteria = this.searchFields[0]
    this.currentSortDesc = true
    moment.locale('es')
    this.$root.$on('table:setState:' + this.eventId, (data) => {
      this.state = data
      // debugger
      // this.currentSeachCriteria = data.filter
      // this.currentSortCriteria = data.sortCriteria
      // this.currentSortDesc = data.sortDirection
      // this.currentPage = data.currentPage
    })
  }
}
</script>
<style>
.invisible {
  display: none;
}
</style>
