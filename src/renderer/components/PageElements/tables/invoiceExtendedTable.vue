<template>
  <div class="table-responsive noOverflow">
    <invoiceFilterBar ref="filterBar"></invoiceFilterBar>
    <table class="table table-bordered" width="100%" cellspacing="0" ref="theTable" id="theTable">
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
    <button id="toExcel" @click="toExcel">Excel</button>
  </div>
</template>

<script>
import pagination from "./pagination";
import Vue from "vue";
import invoiceFilterBar from "./invoiceFilterBar";
import tableMixin from "./tableMixin";
import "xlsx/dist/xlsx.core.min.js";
import "file-saverjs/FileSaver.min.js";
import TableExport from "tableexport";

export default {
  name: "invoiceExtendedTable",
  mixins: [tableMixin],
  components: {
    pagination,
    invoiceFilterBar
  },
  data() {
    return {
      instance: null,
      exportData: null
    };
  },
  methods: {
    setFilter: function(query) {
      this.$refs.filterBar.setFilter(query);
    },
    processFilterChange(filterData) {
      this.$parent.processFilterChange(filterData);
    },
    toExcel() {
      debugger;
      this.instance.export2file(
        this.exportData.data,
        this.exportData.mimeType,
        this.exportData.filename,
        this.exportData.fileExtension
      );
    }
  },
  mounted() {
    this.instance = new TableExport(this.$refs.theTable, {
      formats: ["xlsx", "csv"],
      filename: "pepe",
      sheetname: 'Facturas'
      //bootstrap: true,
      //exportButtons: false
    });
    debugger;
    var x = this.instance.getExportData()
    this.exportData = this.instance.getExportData()["theTable"]["csv"];
  }
};
</script>

<style>
.noOverflow {
  overflow-x: hidden;
}
</style>
