<template>
  <a href="#" class="btn" :class="{'btn-collapsible': isCollapsible === undefined || isCollapsible === true, 'btn-warning': !isDark, 'btn-secondary': isDark}" @click="toExcel">
    <i class="fas fa-file-excel"></i>
    <span class="ml-1">{{text}}</span>
    <b-modal ref="exportingModal" centered title="Exportando" hide-footer no-close-on-backdrop no-close-on-esc hide-header-close>
      <div class="modal-body text-centered">
        Por favor, espere. Esta operación requerirá más tiempo cuantas <br>
        más filas tenga que exportar.
        <div class="mt-4 progress-bar bg-info progress-bar-striped progress-bar-animated" style="width:100%">&nbsp;</div>
      </div>
  </b-modal>
  </a>
</template>

<script>
import "file-saverjs/FileSaver.min.js";
import TableExport from "tableexport";

export default {
  name: 'excelButton',
  data () {
    return {
      text: 'a Excel',
      enablePagination: {},
      disablePagination: {},
      table: {}
    }
  },
  props: {
    fileName: {
      type: String,
      required: true
    },
    isCollapsible: {
      type: Boolean,
      required: false
    },
    collapsed: {
      type: Boolean,
      required: false
    },
    isDark: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    toExcel() {
      this.$refs.exportingModal.show()
      this.disablePagination(this.toExcelCallback)
    },
    toExcelCallback() {
      var instance = new TableExport(this.table.$el, {
        filename: this.fileName,
        exportButtons: false
      });
      var x = instance.getExportData()
      var exportData = x[Object.keys(x)[0]]['xlsx'];
      instance.export2file(
        exportData.data, exportData.mimeType,
        exportData.filename, exportData.fileExtension,
        undefined, undefined,
        this.fileName
      );
      this.$refs.exportingModal.hide()
      this.enablePagination()
    },
    setEnablePaginationCallback(enablePagination){
      this.enablePagination = enablePagination
    },
    setDisablePaginationCallback(disablePagination){
      this.disablePagination = disablePagination
    },
    setTable(table){
      this.table = table
      this.enablePagination = table.enablePagination
      this.disablePagination = table.disablePagination
    }
  },
  mounted () {
    if (this.collapsed === true) {
      this.text = ''
    }
  }
}
</script>
