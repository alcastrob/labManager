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
                  <b-badge variant="secondary" class="position-relative" style="top:-7px" v-if="column.dataField === 'NombreDentista'">{{remainingWorks[row.IdDentista]}}</b-badge>
                </span>

              </td>
            </template>
          </tr>
          <template v-for="work in worksPerDentist[row.IdDentista]">
            <transition name="fade">
              <tr v-if="selectedDentist === row.IdDentista" v-bind:key="'c' + work.IdTrabajo" class="deaggregated" @click="clickedWork($event, row.IdDentista, work.IdTrabajo)">
                <td class="small-text text-right" :class="{'stroke': work.Chequeado, 'bold': !work.Chequeado}">
                  {{work.IdTrabajo}}&nbsp;
                  <input type="checkbox" v-model="work.Chequeado" @change="updateDentistCheck(row.IdDentista)">
                </td>
                <td class="dentist-text column-20" :class="{'stroke': work.Chequeado, 'bold': !work.Chequeado}">
                  {{work.Paciente}}&nbsp;|&nbsp;{{formatDate(work, 'FechaTerminacion')}}&nbsp;|&nbsp;<router-link :to="'/works/details/' + work.IdTrabajo" role="button" :id="'tooltipTarget' + work.IdTrabajo">Ver</router-link>
                </td>
                <b-tooltip :target="'tooltipTarget' + work.IdTrabajo" placement="right" delay="500">
                  <div class="text-left">
                    Tipo: <i class="fas fa-bookmark " :class="work.TipoTrabajo.toLowerCase() + '-color'"></i> {{work.TipoTrabajo}} <br>
                    Color: {{work.Color}}<br>
                    Fecha Entrada: {{formatDate(work, 'FechaEntrada')}}<br>
                    Indicaciones:<br>
                    <ul v-for="indication in workIndications[work.IdTrabajo]" v-bind:key="indication.IdTrabajoDetalle">
                      <li>{{indication.Descripcion}} | {{moneyFormatter.format(indication.Precio)}}</li>
                    </ul>
                  </div>
                </b-tooltip>
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
import { getWorksAggregatedByDentist, getWorksDeaggregatedByDentist, setCheckToWork, getWorkIndications } from '../../../../main/dal.js'
import bBadge from 'bootstrap-vue'

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
      remainingWorks: {},
      selectedDentist: 0,
      workIndications: {}
    }
  },
  methods: {
    //Event responses----------------------------
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
    clickedWork(event, idDentist, idTrabajo){
      var works = this.worksPerDentist[idDentist]
      if (event.srcElement.localName !== 'input' && event.srcElement.localName !== 'a'){
        var work = _.find(works, ['IdTrabajo', idTrabajo])
        work.Chequeado = !work.Chequeado
        setCheckToWork(idTrabajo, work.Chequeado, 'labManager.sqlite')
      }
      else {
        setCheckToWork(idTrabajo, event.srcElement.checked, 'labManager.sqlite')
      }
      this.remainingWorks[idDentist] = this.calculateRemainingWorks(works)

      this.updateDentistCheck(idDentist)
      this.$forceUpdate()
    },

    //Calculations-------------------------------
    calculateRemainingWorks(works) {
      var remainingCandidates = _.filter(works, function(w) {
        return w.Chequeado === 0 || w.Chequeado === false
      })
      return remainingCandidates.length===0?'':remainingCandidates.length
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

    //Verifications------------------------------
    areAllWorksOfDentistChecked(idDentist){
      return this.calculateRemainingWorks(this.worksPerDentist[idDentist]).length === 0
    },
    isEditable: function(field) {
      return field === 'percentage'
    },
    isButton: function(field) {
      return field === 'estado'
    },
    selectedForInvoice(event, idDentist){
      this.selectedDentist = idDentist
      this.$forceUpdate()
      if (!this.areAllWorksOfDentistChecked(idDentist)) {
        event.srcElement.checked = false
      }
    },

    //Updates and manipulation of the UI---------
    updateDentistCheck(idDentist) {
      document.getElementById('chkDentist-' + idDentist).checked = this.areAllWorksOfDentistChecked(idDentist)
    },
    setCellValue(position, currentElement, value) {
      currentElement.parentNode.parentNode.children[position].children[0].setAttribute('value', value)
      currentElement.parentNode.parentNode.children[position].children[0].innerText = moneyFormatter.format(value)
    },
    getCellValue(position, currentElement) {
      return parseFloat(currentElement.parentNode.parentNode.children[position].children[0].attributes["value"].value)
    },
    formatDate(row, field) {
      var returnedValue = moment(row[field]).format('DD/MM/YYYY')
      if (returnedValue !== 'Invalid date') {
        return returnedValue
      } else {
        return ''
      }
    },

    //Persistence--------------------------------
    getWorksOfDentist(idDentist) {
      getWorksDeaggregatedByDentist(parseInt(this.year), parseInt(this.month), idDentist, 'labManager.sqlite').then(this.getWorksOfDentist_Companion)
    },
    getWorksOfDentist_Companion(works) {
      if (works.length > 0) {
        var idDentista = works[0].IdDentista
        this.worksPerDentist[idDentista] = works

        this.remainingWorks[idDentista] = this.calculateRemainingWorks(works)

        for (var work of works){
          this.getWorkIndications(work.IdTrabajo)
        }
        this.$forceUpdate()
      }
    },
    getWorkIndications(idTrabajo) {
      getWorkIndications(idTrabajo, 'labManager.sqlite').then(this.getWorkIndications_Companion)
    },
    getWorkIndications_Companion(workIndications){
      if (workIndications.length > 0) {
        var idTrabajo = workIndications[0].IdTrabajo
        this.workIndications[idTrabajo] = workIndications
      }
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
  },
  computed: {
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
/* .compostura-color {
  color: #4CFF40;
} */


</style>