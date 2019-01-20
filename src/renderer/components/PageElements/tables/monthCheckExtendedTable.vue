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
        <!-- The rows of the dentists -->
        <template v-for="row in rawDataset">
          <tr v-bind:key="'dentist-' + row.IdDentista" v-on:click="toggleWorksRows($event, row.IdDentista)">
            <template v-for="column in headers">
              <td v-bind:key="'b' + column.dataField" v-bind:class="column.rowClass">

                <input type="checkbox" v-if="isButton(column.dataField)" @change="forceSomeWorksChechedBeforCheckingTheDentist($event, row.IdDentista)" :id="'chkDentist-' + row.IdDentista">

                <div v-else>
                  <span v-if="column.dataField === 'percentage'"></span>
                  <span v-else :value="row[column.dataField]">
                  {{formatRow(row[column.dataField], column.formatter)}}</span>

                  <b-badge variant="secondary" class="position-relative" style="top:-7px" v-if="column.dataField === 'NombreDentista'">{{remainingWorks[row.IdDentista]}}</b-badge>

                  <span v-if="column.dataField === 'NombreDentista' && isReadOnly && (invoicesPerDentist[row.IdDentista] !== undefined && invoicesPerDentist[row.IdDentista] !== [])">

                    <span v-for="invoice in invoiceIdsOfDentist(invoicesPerDentist[row.IdDentista])" v-bind:key="invoice.IdTrabajo">
                      - <router-link :to="'/finances/invoices/' + invoice.IdFactura">{{invoice.NumFactura}}</router-link>
                    </span>

                  </span>

                </div>
              </td>
            </template>
          </tr>
          <!-- The rows of the works -->
          <template v-for="work in worksPerDentist[row.IdDentista]">
            <transition name="fade">

              <tr v-bind:key="'work-' + work.IdTrabajo" v-if="selectedDentist === row.IdDentista" class="deaggregated" @click="clickedWork($event, row.IdDentista, work.IdTrabajo)">
                <td class="small-text text-right" :class="{'strikethrough': work.Chequeado, 'bold': !work.Chequeado}">
                  {{work.IdTrabajo}}&nbsp;
                  <input type="checkbox" v-model="work.Chequeado" @change="updateDentistCheckbox(row.IdDentista)">
                </td>

                <td class="dentist-text column-20" :class="{'strikethrough': work.Chequeado, 'bold': !work.Chequeado}">

                  {{work.Paciente}}&nbsp;|&nbsp;{{formatDate(work, 'FechaTerminacion')}}&nbsp;|&nbsp;
                  
                  <router-link :to="'/works/details/' + work.IdTrabajo" role="button" :id="'tooltipTarget' + work.IdTrabajo">Ver</router-link>

                  <span v-if="isReadOnly && invoicesPerDentist[row.IdDentista].length !== 0">&nbsp;|&nbsp;
                    <router-link :to="'/finances/invoices/' + invoiceIdOfWork(invoicesPerDentist[row.IdDentista], work.IdTrabajo)">{{invoiceIdOfWork(invoicesPerDentist[row.IdDentista], work.IdTrabajo)}}</router-link>
                  </span>
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
                <td class="small-text text-right" :class="{'strikethrough': work.Chequeado, 'bold': !work.Chequeado}">
                  {{moneyFormatter.format(work.SumaPrecioFinal)}}
                </td>
                <td class="small-text text-right" :class="{'strikethrough': work.Chequeado, 'bold': !work.Chequeado}">
                  {{moneyFormatter.format(work.SumaAditamentos)}}
                </td>
                <td class="small-text text-right" :class="{'strikethrough': work.Chequeado, 'bold': !work.Chequeado}">
                  {{moneyFormatter.format(work.SumaCeramica)}}
                </td>
                <td class="small-text text-right" :class="{'strikethrough': work.Chequeado, 'bold': !work.Chequeado}">
                  {{moneyFormatter.format(work.SumaResina)}}
                </td>
                <td class="small-text text-right" :class="{'strikethrough': work.Chequeado, 'bold': !work.Chequeado}">
                  {{moneyFormatter.format(work.SumaOrtodoncia)}}
                </td>
                <td class="small-text text-right" :class="{'strikethrough': work.Chequeado, 'bold': !work.Chequeado}">
                  {{moneyFormatter.format(work.SumaEsqueletico)}}
                </td>
                <td class="small-text text-right" :class="{'strikethrough': work.Chequeado, 'bold': !work.Chequeado}">
                  {{moneyFormatter.format(work.SumaZirconio)}}
                </td>
                <td class="small-text text-right" :class="{'strikethrough': work.Chequeado, 'bold': !work.Chequeado}">
                  {{moneyFormatter.format(work.SumaFija)}}
                </td>
                <td class="small-text text-right" :class="{'strikethrough': work.Chequeado, 'bold': !work.Chequeado}">
                  {{moneyFormatter.format(work.SumaTotalMetal)}}
                </td>
                <td class="noMargins" :class="{'strikethrough': work.Chequeado, 'bold': !work.Chequeado}">
                  <percentageInput class="inputInTd small-text text-right" :class="{'strikethrough': work.Chequeado, 'bold': !work.Chequeado}" v-model="work.PorcentajeDescuento" @change="percentageDiscountChanged(work, row.IdDentista)"></percentageInput>
                </td>
                <td class="noMargins" :class="{'strikethrough': work.Chequeado, 'bold': !work.Chequeado}">
                  <euroInput v-model="work.TotalDescuento" class="inputInTd small-text text-right" :class="{'strikethrough': work.Chequeado, 'bold': !work.Chequeado}" @change="totalDiscountChanged(work, row.IdDentista)"></euroInput>
                </td>
                <td class="small-text text-right noMargins" :class="{'strikethrough': work.Chequeado, 'bold': !work.Chequeado}">
                  {{calcProductTotal(work)}}
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
'use strict'

import Vue from 'vue'
import FloatThead from 'vue-floatthead'
import _ from 'lodash'
import moment from 'moment'
import tableMixin from './tableMixin'
import { getWorksAggregatedByDentist, getWorksDeaggregatedByDentist, setCheckToWork, getWorkIndications, getInvoicesPerDentist } from '../../../../main/dal.js'
import bBadge from 'bootstrap-vue'
import euroInput from '../tables/euroInput'
import percentageInput from '../tables/percentageInput'
import Router from 'vue-router'

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
    FloatThead,
    euroInput,
    percentageInput
   },
  props: {
    year: {
      type: String,
      required: true
    },
    month: {
      type: String,
      required: true
    },
    'value': {
      type: Array,
      required: false
    }
  },
  data () {
    return {
      //The sums of all the dataset(grouped by column, i.e. SumaFija, SumaOrtodoncia...)
      sums: {},

      //A mapping of column indexes and column name
      columnIndex: {},

      //The sum values that are contained on the column headers (including the money format)
      subheaders: {},

      //The all work entities, grouped by dentistId
      worksPerDentist: {},

      //All the invoices related with this month, grouped by dentistId
      invoicesPerDentist: {},

      //The count of works without the check, grouped by dentist (used by the badges)
      remainingWorks: {},

      //The dentistId that currently is selected
      selectedDentist: 0,

      //The indications of every work in the dataset (used by tooltips)
      workIndications: {},

      //The dentistId of the dentists with the checkbox set
      dentistsChecked: [],

      //If true, the table will show ALL the dentists and works, regardless they where associated to an invoice or not
      isReadOnly: false,
    }
  },
  methods: {
    //Event responses----------------------------
    toggleWorksRows(event, idDentist) {
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
        setCheckToWork(idTrabajo, work.Chequeado)
      }
      else {
        setCheckToWork(idTrabajo, event.srcElement.checked)
      }

      this.updateDentistCheckbox(idDentist)
    },
    percentageDiscountChanged(work, idDentista) {
      work.TotalDescuento = parseFloat(work.SumaPrecioFinal * work.PorcentajeDescuento / 100).toFixed(2)
      this.applyDiscount(work)
    },
    totalDiscountChanged(work, idDentista) {
      work.PorcentajeDescuento = parseFloat( work.TotalDescuento * 100 / work.SumaPrecioFinal).toFixed(2)
      this.applyDiscount(work)
    },

    //Calculations-------------------------------
    calculateRemainingWorks(works) {
      var remainingCandidates = _.filter(works, function(w) {
        return w.Chequeado === 0 || w.Chequeado === false
      })
      return remainingCandidates.length===0?'':remainingCandidates.length
    },
    calcProductTotal: function(work) {
      return moneyFormatter.format(work.SumaPrecioFinal -  work.TotalDescuento)
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
    applyDiscount: function(work){
      this.$forceUpdate()
    },
    // updateTotal: function(a, key) {
    //   var totalMetal = this.getCellValue(this.columnIndex['SumaTotalMetal'], event.srcElement)
    //   var precioMetal = this.getCellValue(this.columnIndex['SumaAditamentos'], event.srcElement)
    //   var percentage = parseFloat(event.target.value)
    //   if (isNaN(percentage)){
    //     percentage = 0
    //   }
    //   var dto = totalMetal * (percentage / 100)
    //   var grandTotal = totalMetal - dto + precioMetal
    //   var row = _.find(this.rawDataset, ['IdDentista', key])
    //   row['SumaDescuento'] = dto
    //   row['SumaGranTotal'] = grandTotal
    //   this.setCellValue(this.columnIndex['SumaDescuento'], event.srcElement, dto)
    //   this.setCellValue(this.columnIndex['SumaGranTotal'], event.srcElement, grandTotal)
    //   this.calcColumnSums(['SumaDescuento', 'SumaGranTotal'])
    // },

    //Verifications------------------------------
    isAnyWorkOfDentistChecked(idDentist){
      return _.some(this.worksPerDentist[idDentist], function(w) {
        return w.Chequeado !== 0 && w.Chequeado !== false
      })
    },
    isButton: function(field) {
      return field === 'estado'
    },

    //Updates and manipulation of the UI---------
    forceSomeWorksChechedBeforCheckingTheDentist(event, idDentist){
      this.selectedDentist = idDentist
      this.$forceUpdate()
      if (!this.isAnyWorkOfDentistChecked(idDentist)) {
        event.srcElement.checked = false
      }
      if (event.srcElement.checked) {
        if (_.find(this.dentistsChecked, (d) => { return d === idDentist}) === undefined) {
          this.dentistsChecked.push(idDentist)
        }
      } else {
        this.dentistsChecked = _.remove(this.dentistsChecked, function(d) {
          return d !== idDentist
        })
      }
      //Send the data to the v-model of the container
      this.emitDataBack()
    },
    updateDentistCheckbox(idDentist) {
      var areChecked = this.isAnyWorkOfDentistChecked(idDentist)
      document.getElementById('chkDentist-' + idDentist).checked = areChecked
      if (areChecked) {
        if (_.find(this.dentistsChecked, (d) => { return d === idDentist}) === undefined) {
          this.dentistsChecked.push(idDentist)
        }
      } else {
        this.dentistsChecked = _.remove(this.dentistsChecked, (d) => {
          return d !== idDentist
        })
      }
      //Updates the count of the badge
      this.remainingWorks[idDentist] = this.calculateRemainingWorks(this.worksPerDentist[idDentist])
      this.$forceUpdate()

      //Send the data to the v-model of the container
      this.emitDataBack()
    },
    uncheckAllDentistCheckbox(){
      for(var dentist of this.dentistsChecked){
        document.getElementById('chkDentist-' + dentist).checked = false
      }
      this.dentistsChecked = []
    },
    emitDataBack(){
      var returnedValue = []
      for (var dentistId of this.dentistsChecked) {
        var dentistData = _.find(this.rawDataset, ['IdDentista', dentistId])
        var dentistWorks = _.filter(this.worksPerDentist[dentistId], (o) => {
          return o.Chequeado === true || o.Chequeado === 1
          })

        returnedValue.push({
          IdDentista: dentistId,
          NombreDentista: dentistData.NombreDentista,
          selectedWorks: dentistWorks
         })
      }
      this.$emit('input', returnedValue)
    },
    forceFullReload() {
      this.getWorksAggregated(this.year, this.month)
      this.uncheckAllDentistCheckbox()
    },
    forceTableHeaderReflow() {
      this.$refs.table.reflow()
    },
    setReadOnlyMode(isReadOnly) {
      this.isReadOnly = isReadOnly
    },
    invoiceIdsOfDentist(invoice) {
      if (invoice.length === 0 || invoice === undefined) {
        return []
      } else {
        return _.uniqBy(invoice, 'NumFactura')
      }
    },
    invoiceIdOfWork(invoice, workId){
      if (invoice.length === 0) {
        return ''
      } else {
        return _.find(invoice, ['IdTrabajo', workId]).NumFactura
      }
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
    getWorksOfDentist: async function(idDentist) {
      var works = await getWorksDeaggregatedByDentist(parseInt(this.year), parseInt(this.month), idDentist, this.isReadOnly)
      if (works.length > 0) {
        var idDentist = works[0].IdDentista
        this.worksPerDentist[idDentist] = works
        this.remainingWorks[idDentist] = this.calculateRemainingWorks(works)
        for (var work of works){
          // work.TotalDescuento = moneyFormatter.format(work.TotalDescuento)
          this.getWorkIndications(work.IdTrabajo)
        }
        this.$forceUpdate()
      }
    },
    getWorkIndications: async function(idTrabajo) {
      var workIndications = await getWorkIndications(idTrabajo)
      if (workIndications.length > 0) {
        var idTrabajo = workIndications[0].IdTrabajo
        this.workIndications[idTrabajo] = workIndications
      }
    },
    getWorksAggregated: async function(year, month){
      this.rawDataset = await getWorksAggregatedByDentist(parseInt(year), parseInt(month), this.isReadOnly)
      this.calcColumnSums(['SumaPrecioFinal', 'SumaAditamentos', 'SumaCeramica', 'SumaResina', 'SumaOrtodoncia', 'SumaEsqueletico', 'SumaZirconio', 'SumaFija', 'SumaTotalMetal', 'SumaDescuento', 'SumaGranTotal'])

      for(var dentist of this.rawDataset) {
        await this.getWorksOfDentist(dentist.IdDentista)
        if (this.isReadOnly) {
          this.invoicesPerDentist[dentist.IdDentista] = await getInvoicesPerDentist(year, month, dentist.IdDentista)
        }
      }
    }
  },
  mounted() {
    // Check the required parameters (props)
    if (this.year === undefined || this.year === null)
      throw 'Missing prop year in monthCheckExtendedTable.vue'
    if (this.month === undefined || this.month === null)
      throw 'Missing prop month in monthCheckExtendedTable.vue'

    this.getWorksAggregated(this.year, this.month)
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
.strikethrough {
  font-weight: normal;
  text-decoration: line-through;
  background-color: #F9DBD4;
}

.small-text {
  font-size: .8em;
  padding-left: 3px!important;
  padding-right: 2px!important;
  padding-top: 5px!important;
  padding-bottom: 5px!important;
  vertical-align: text-top;
  resize: none;
  overflow: hidden;
  
}
.dentist-text {
  font-size: .8em;
  font-style: italic;
  padding-left: 15px!important;
  padding-right: 3px!important;
  padding-top: 5px!important;
  padding-bottom: 5px!important;
}

.column20 {
  width: 20%;
}
.column7 {
  width: 7%;
}
.column5 {
  width: 5%;
}
.column3 {
  width: 3%;
}
</style>