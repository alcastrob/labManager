<template>
  <div class="table-responsive">
    <div ref="filterContainer"></div>
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
import Vue from 'Vue'
import filterBar from './filterBar'
import workFilterBar from '../../PageElements/tables/workFilterBar'
import tableMixin from './tableMixin'

export default {
  name: 'myTable',
  mixins: [tableMixin],
  components: {
    pagination,
    filterBar
  },
  mounted () {
    this.currentSortCriteria = this.searchFields[0]
    this.currentSortDesc = true

// Loading the filter component based ion configuration
    var ComponentClass, instance
    if (this.filterType === 'WorkFilterBar'){
      ComponentClass = Vue.extend(workFilterBar)
      instance = new ComponentClass({
        propsData: {
          filterName: this.filterName
        }
      })
    } else {
      ComponentClass = Vue.extend(filterBar)
      instance = new ComponentClass()
    }
    instance.$parent = this
    instance.$root = this.$root
    instance.$mount()
    this.$refs.filterContainer.appendChild(instance.$el)
  }
}
</script>
<style>
.invisible {
  display: none;
}
</style>
