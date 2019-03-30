<template>
  <div class>
    <filterBar></filterBar>
    <table class="table table-bordered table-responsive" width="100%" cellspacing="0">
      <thead>
        <tr>
          <th
            v-for="header in headers"
            v-bind:key="header.dataField"
            v-on:click="sortByExpression(header.dataField)"
            v-bind:class="header.titleClass"
          >
            {{header.title}}
            <span
              v-if="currentSortCriteria === header.dataField"
              class="fas"
              :class="{'fa-sort-amount-down': currentSortCriteria === header.dataField && currentSortDesc === true,
            'fa-sort-amount-up': currentSortCriteria === header.dataField && currentSortDesc === false}"
            ></span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in getPaginatedData()" v-bind:key="row[0]" v-on:click="clickOn(row['Key'])">
          <template v-for="column in headers">
            <td
              v-bind:key="column.dataField"
              v-bind:class="column.rowClass"
            >{{formatRow(row[column.dataField], column.formatter)}}</td>
          </template>
        </tr>
      </tbody>
    </table>
    <pagination></pagination>
  </div>
</template>

<script>
import pagination from './pagination'
import filterBar from './filterBar'
import tableMixin from './tableMixin'

export default {
	name: 'dentistTable',
	mixins: [tableMixin],
	components: {
		pagination,
		filterBar
	},
	mounted() {
		this.currentSortCriteria = this.searchFields[0]
		this.currentSortDesc = true
	}
}
</script>
