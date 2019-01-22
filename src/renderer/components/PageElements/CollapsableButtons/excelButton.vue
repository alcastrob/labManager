<template>
  <a href="#" class="btn btn-warning btn-collapsible" @click="toExcel">
    <i class="fas fa-file-excel mr-2"></i>
    <span>a Excel</span>
  </a>


  <!-- <button type="button" @click="toExcel" class="btn btn-warning"><i class="fas fa-file-excel mr-2"></i>a Excel</button> -->
</template>

<script>
import "file-saverjs/FileSaver.min.js";
import TableExport from "tableexport";

export default {
  name: 'excelButton',
  data () {
    return {}
  },
  props: {
    fileName: {
      type: String,
      required: true
    },
    tableId: {
      type: String,
      required: true
    }
  },
  methods: {
    toExcel() {
       var instance = new TableExport(document.getElementById(this.tableId), {
        filename: this.fileName,
        exportButtons: false
      });
      var exportData = instance.getExportData()[this.tableId]["xlsx"];
      instance.export2file(
        exportData.data, exportData.mimeType,
        exportData.filename, exportData.fileExtension,
        undefined, undefined,
        this.fileName
      );
    }
  }
}
</script>

<style>
</style>
