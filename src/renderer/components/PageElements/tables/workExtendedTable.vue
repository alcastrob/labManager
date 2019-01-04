<template>
  <div class="table-responsive">
    <workFilterBar ref="filterBar"></workFilterBar>
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
import Vue from 'vue'
import workFilterBar from './workFilterBar'
import tableMixin from './tableMixin'

export default {
  name: 'workExtendedTable',
  mixins: [tableMixin],
  components: {
    pagination,
    workFilterBar
  },
  methods: {
    setFilters: function(filterName) {
      this.$refs.filterBar.setFilterName(filterName)
    },
    processFilterChange(filterData) {
      this.$parent.processFilterChange(filterData)
    }
  },
  mounted() {
  }
}
</script>

<style>
</style>
