<template>
  <div class="table-responsive">
    <float-thead-table class="table table-bordered" :top="56" ref="table" :autoReflow="true" >
      <thead>
        <tr>
          <th v-for="header in headers" v-bind:key="header.dataField"
            v-bind:class="header.titleClass">
            {{header.title}}<br>{{subheaders[header.dataField]}}
          </th>
        </tr>
      </thead>
      <tbody>
        <template v-for="row in rawDataset">
          <tr v-bind:key="'a' + row.IdDentista" v-on:click="toggleExtraData($event, row.IdDentista)">
            <template v-for="column in headers">
              <td v-bind:key="'b' + column.dataField" v-bind:class="column.rowClass">
                <input type="text" v-if="isEditable(column.dataField)" class="inputInTd small-text text-right" @change="updateTotal($event, row.IdDentista)">
                <input type="checkbox" v-else-if="isButton(column.dataField)" @change="selectedForInvoice($event, row.IdDentista)" :id="'chkDentist-' + row.IdDentista">
                <span v-else :value="row[column.dataField]">
                  {{formatRow(row[column.dataField], column.formatter)}}
                </span>
              </td>
            </template>
          </tr>
          <template v-for="work in worksPerDentist[row.IdDentista]">
            <transition name="fade">
              <tr v-if="selectedDentist === row.IdDentista" v-bind:key="'c' + work.IdTrabajo" class="deaggregated" @click="clickedWork($event, row.IdDentista, work.IdTrabajo)">
                <td class="small-text text-right" :class="{'stroke': work.Chequeado, 'bold': !work.Chequeado}">
                  {{work.IdTrabajo}}&nbsp;<input type="checkbox" v-model="work.Chequeado">
                </td>
                <td class="dentist-text column-20" :class="{'stroke': work.Chequeado, 'bold': !work.Chequeado}">
                  {{work.Paciente}}&nbsp;|&nbsp;{{endDate(work)}}
                </td>
                <td class="small-text text-right" :class="{'stroke': work.Chequeado, 'bold': !work.Chequeado}">
                  {{moneyFormatter.format(work.SumaPrecioFinal)}}
                </td>
                <td class="small-text text-right" :class="{'stroke': work.Chequeado, 'bold': !work.Chequeado}">
                  {{moneyFormatter.format(work.SumaAditamentos)}}
                </td>
                <td class="small-text text-right" :class="{'stroke': work.Chequeado, 'bold': !work.Chequeado}">
                  {{moneyFormatter.format(work.SumaCeramica)}}
                </td>
                <td class="small-text text-right" :class="{'stroke': work.Chequeado, 'bold': !work.Chequeado}">
                  {{moneyFormatter.format(work.SumaResina)}}
                </td>
                <td class="small-text text-right" :class="{'stroke': work.Chequeado, 'bold': !work.Chequeado}">
                  {{moneyFormatter.format(work.SumaOrtodoncia)}}
                </td>
                <td class="small-text text-right" :class="{'stroke': work.Chequeado, 'bold': !work.Chequeado}">
                  {{moneyFormatter.format(work.SumaEsqueletico)}}
                </td>
                <td class="small-text text-right" :class="{'stroke': work.Chequeado, 'bold': !work.Chequeado}">
                  {{moneyFormatter.format(work.SumaZirconio)}}
                </td>
                <td class="small-text text-right" :class="{'stroke': work.Chequeado, 'bold': !work.Chequeado}">
                  {{moneyFormatter.format(work.SumaFija)}}
                </td>
                <td class="small-text text-right" :class="{'stroke': work.Chequeado, 'bold': !work.Chequeado}">
                  {{moneyFormatter.format(work.SumaTotalMetal)}}
                </td>
                <td class="small-text text-right" :class="{'stroke': work.Chequeado, 'bold': !work.Chequeado}"> ---
                </td>
                <td class="small-text text-right" :class="{'stroke': work.Chequeado, 'bold': !work.Chequeado}"> ---
                </td>
                <td class="small-text text-right" :class="{'stroke': work.Chequeado, 'bold': !work.Chequeado}"> ---
                </td>
              </tr>
            </transition>

          </template>
         </template>
      </tbody>
    </float-thead-table>
  </div>
</template>

<script>
import Vue from 'vue'
import FloatThead from 'vue-floatthead'
import _ from 'lodash'
import moment from 'moment'
import tableMixin from './tableMixin'
import { getWorksAggregatedByDentist, getWorksDeaggregatedByDentist, setCheckToWork } from '../../../../main/dal.js'

Vue.use(FloatThead)

var lastClickedRow = -1, rowsAdded = 0
var moneyFormatter = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR'
})

export default {
  name: 'monthCheckExtendedTable',
  mixins: [tableMixin],
  components: {
    FloatThead
   },
  props: {
    year: {
      type: String,
      required: true
    },
    month: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      sums: {},
      columnIndex: {},
      subheaders: {},
      worksPerDentist: {},
      selectedDentist: 0
    }
  },
  methods: {
    isEditable: function(field) {
      return field === 'percentage'
    },
    isButton: function(field) {
      return field === 'estado'
    },
    updateTotal: function(a, key) {
      var totalMetal = this.getCellValue(10, event.srcElement)
      var precioMetal = this.getCellValue(3, event.srcElement)
      var percentage = parseFloat(event.target.value)
      if (isNaN(percentage)){
        percentage = 0
      }
      var dto = totalMetal * (percentage / 100)
      var grandTotal = totalMetal - dto + precioMetal
      var row = _.find(this.rawDataset, ['IdDentista', key])
      row['SumaDescuento'] = dto
      row['SumaGranTotal'] = grandTotal
      this.setCellValue(12, event.srcElement, dto)
      this.setCellValue(13, event.srcElement, grandTotal)
      this.calcColumnSums(['SumaDescuento', 'SumaGranTotal'])
    },
    setCellValue(position, currentElement, value) {
      currentElement.parentNode.parentNode.children[position].children[0].setAttribute('value', value)
      currentElement.parentNode.parentNode.children[position].children[0].innerText = moneyFormatter.format(value)
    },
    getCellValue(position, currentElement) {
      return parseFloat(currentElement.parentNode.parentNode.children[position].children[0].attributes["value"].value)
    },
    calcColumnSums: function(includedColumns){
      for (var column of this.headers){
        var columnName = column.dataField
        if (includedColumns.includes(columnName)){
          this.sums[columnName] = 0
          this.columnIndex[columnName] = _.findIndex(this.headers, ['dataField', columnName])
        }
      }
      for (var row of this.rawDataset){
        for (var field in row){
          if (includedColumns.includes(field)){
            this.sums[field] += row[field]
          }
        }
      }
      for (var column of this.headers){
        if(includedColumns.includes(column.dataField)){
          this.subheaders[column.dataField] = moneyFormatter.format(this.sums[column.dataField])
        }
      }
    },
    getWorksOfDentist(idDentist) {
      getWorksDeaggregatedByDentist(parseInt(this.year), parseInt(this.month), idDentist, 'labManager.sqlite').then(this.assignWorks)
    },
    assignWorks(works) {
      if (works.length > 0) {
        var idDentista = works[0].IdDentista
        this.worksPerDentist[idDentista] = works
      }
    },
    toggleExtraData(event, idDentist) {
      this.$forceUpdate()
      if (event.srcElement.localName !== 'input'){
        if (this.selectedDentist !== idDentist){
          this.selectedDentist = idDentist
        } else {
          this.selectedDentist = 0
        }
      }
    },
    selectedForInvoice(event, idDentist){
      this.selectedDentist = idDentist
      this.$forceUpdate()
      if (!this.areAllWorksOfDentistChecked(idDentist)) {
        event.srcElement.checked = false
      }
    },
    areAllWorksOfDentistChecked(idDentist){
      var result = true
      var works = this.worksPerDentist[idDentist]
      for (var work of works) {
        result = result && work.Chequeado
      }
      return result
    },
    endDate(work) {
      return moment(work.FechaTerminacion).format('DD/MM/YYYY')
    },
    clickedWork(event, idDentist, idTrabajo){
      if (event.currentTarget.localName !== 'input'){
        var works = this.worksPerDentist[idDentist]
        var work = _.find(works, ['IdTrabajo', idTrabajo])
        work.Chequeado = !work.Chequeado
        setCheckToWork(idTrabajo, work.Chequeado, 'labManager.sqlite')
      }
      else {
        setCheckToWork(idTrabajo, event.currentTarget.checked, 'labManager.sqlite')
      }
      this.$forceUpdate()
      document.getElementById('chkDentist-' + idDentist).checked = this.areAllWorksOfDentistChecked(idDentist)
    }
  },
  created() {
    // Check the required parameters (props)
    if (this.year === undefined || this.year === null)
      throw 'Missing prop year in monthCheckExtendedTable.vue'
    if (this.month === undefined || this.month === null)
      throw 'Missing prop month in monthCheckExtendedTable.vue'

    getWorksAggregatedByDentist(parseInt(this.year), parseInt(this.month), 'labManager.sqlite').then((dentistGroup) => {
      this.rawDataset = dentistGroup
      this.calcColumnSums(['SumaPrecioFinal', 'SumaAditamentos', 'SumaCeramica', 'SumaResina', 'SumaOrtodoncia', 'SumaEsqueletico', 'SumaZirconio', 'SumaFija', 'SumaTotalMetal', 'SumaDescuento', 'SumaGranTotal'])

      for(var dentist of this.rawDataset) {
        this.getWorksOfDentist(dentist.IdDentista)
      }
    })

  }
}
</script>
<style>
.fade-enter-active {
  transition: opacity .5s;
}
.fade-leave-active {
  transition: opacity .06s;
}
.fade-enter {
  opacity: 0;
}
.fade-leave-to {
  opacity: 1;
}
.stroke {
  font-weight: normal;
  text-decoration: line-through;
  background-color: #F9DBD4;
}
.bold {
  /* font-weight: bold; */
}


</style>