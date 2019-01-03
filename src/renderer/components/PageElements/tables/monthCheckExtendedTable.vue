<template>
  <div class="table-responsive">
    <table class="table table-bordered" width="100%" cellspacing="0">
      <tr>
        <th v-for="header in headers" v-bind:key="header.dataField"
          v-bind:class="header.titleClass">
          {{header.title}}
        </th>
      </tr>
      <tr v-for="row in getPaginatedData()" v-bind:key="row[0]" v-on:click="clickOn(row['Key'])">
        <template v-for="column in headers">
          <td v-bind:key="column.dataField" v-bind:class="column.rowClass">{{formatRow(row[column.dataField], column.formatter)}}</td>
        </template>
      </tr>
    </table>
  </div>
</template>

<script>
import Vue from 'Vue'
import tableMixin from './tableMixin'


export default {
  name: 'monthCheckExtendedTable',
  mixins: [tableMixin],
  components: { },
  methods: {
    setFilters: function(filterName) {
      this.$refs.filterBar.setFilterName(filterName)
    },
    processFilterChange(filterData) {
      this.$parent.processFilterChange(filterData)
    }
  },
  mounted () {
  }
}
</script>

<style>
</style>
