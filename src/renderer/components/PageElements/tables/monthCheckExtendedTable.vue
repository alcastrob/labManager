<template>
  <div class="table-responsive">
    <float-thead-table class="table table-bordered" :top="56">
      <thead>
        <tr>
          <th v-for="header in headers" v-bind:key="header.dataField"
            v-bind:class="header.titleClass">
            <!-- {{header.title}}<br>{{getSum(header.dataField)}} -->
            {{header.title}}<br>{{subheaders[header.dataField]}}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rawDataset" v-bind:key="row[0]"
        v-on:click="toggleExtraData($event, row['Key'])">
          <template v-for="column in headers">
            <td v-bind:key="column.dataField" v-bind:class="column.rowClass">
              <input type="text" v-if="isEditable(column.dataField)" class="inputInTd small-text text-right" @change="updateTotal($event, row['Key'])">
              <span v-else :value="row[column.dataField]">
                {{formatRow(row[column.dataField], column.formatter)}}
              </span>
            </td>
          </template>
        </tr>
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
import { getWorksAggregatedByDentist, getWorksDeaggregatedByDentist } from '../../../../main/dal.js'

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
      subheaders: {}
    }
  },
  methods: {
    isEditable: function(field) {
      return field === 'percentage'
    },
    updateTotal: function(a, key) {
      var totalMetal = parseFloat(event.srcElement.parentNode.parentNode.children[11].children[0].attributes["value"].value)
      var precioMetal = parseFloat(event.srcElement.parentNode.parentNode.children[4].children[0].attributes["value"].value)
      var percentage = parseFloat(event.target.value)
      var dto = totalMetal * (percentage / 100)
      var grandTotal = totalMetal - dto + precioMetal
      var row = _.find(this.rawDataset, ['IdDentista', key])
      row['SumaDescuento'] = dto
      row['SumaGranTotal'] = grandTotal
      this.setCellValue(13, event.srcElement, dto)
      this.setCellValue(14, event.srcElement, grandTotal)
      this.calcColumnSums(['SumaDescuento', 'SumaGranTotal'])
    },
    setCellValue(position, currentElement, value) {
      currentElement.parentNode.parentNode.children[position].children[0].setAttribute('value', value)
      currentElement.parentNode.parentNode.children[position].children[0].innerText = moneyFormatter.format(value)
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
          if (field !== 'IdDentista' && field !== 'Key' && field !== 'NombreDentista'){
            this.sums[field] += row[field]
          }
        }
      }
      for (var column of this.headers){
        this.subheaders[column.dataField] = this.getSum(column.dataField)
      }
    },
    getSum(field){
      if (field !== 'IdDentista' && field !== 'Key' && field !== 'estado' && field !== 'NombreDentista' && field !== 'percentage'){
        return moneyFormatter.format(this.sums[field])
      } else {
        return ''
      }
    },
    toggleExtraData(event, idDentist, b) {
      var table = event.currentTarget.parentElement
      var clickedRowOrder = event.currentTarget.rowIndex

      this.removeExtraRows(table)
      if (lastClickedRow !== clickedRowOrder) {
        // The table uses position index to insert and delete, instead of keys.
        // If the inserted rows of the previous selected value are BENEATH the new position, when you remote the previos rows, you will have a mistmatch on the insertion position.
        if (lastClickedRow !== -1 && clickedRowOrder > lastClickedRow) {
          clickedRowOrder -= rowsAdded
        }
        lastClickedRow = clickedRowOrder
        getWorksDeaggregatedByDentist(parseInt(this.year), parseInt(this.month), idDentist, 'labManager.sqlite').then((workDetails) => {
          rowsAdded = workDetails.length
          _.forEach(workDetails, function(work) {
            var row = table.insertRow(clickedRowOrder)
            row.classList.add('deaggregated')

            var cell = row.insertCell(0)
            cell.classList.add('very-small-text')
            cell.classList.add('text-right')
            cell.innerHTML = `${work.IdTrabajo}`

            cell = row.insertCell(1)
            cell.classList.add('dentist-text')
            cell.innerHTML = `${work.Paciente} | ${moment(work.FechaTerminacion).format('DD/MM/YYYY')}`

            cell = row.insertCell(2)
            cell.classList.add('very-small-text')
            cell.classList.add('text-right')
            cell.innerHTML = `${moneyFormatter.format(work.SumaPrecioFinal)}`

            cell = row.insertCell(3)
            cell.classList.add('very-small-text')
            cell.classList.add('text-right')
            cell.innerHTML = `${moneyFormatter.format(work.SumaAditamentos)}`

            cell = row.insertCell(4)
            cell.classList.add('very-small-text')
            cell.classList.add('text-right')
            cell.innerHTML = `${moneyFormatter.format(work.SumaCeramica)}`

            cell = row.insertCell(5)
            cell.classList.add('very-small-text')
            cell.classList.add('text-right')
            cell.innerHTML = `${moneyFormatter.format(work.SumaResina)}`

            cell = row.insertCell(6)
            cell.classList.add('very-small-text')
            cell.classList.add('text-right')
            cell.innerHTML = `${moneyFormatter.format(work.SumaOrtodoncia)}`

            cell = row.insertCell(7)
            cell.classList.add('very-small-text')
            cell.classList.add('text-right')
            cell.innerHTML = `${moneyFormatter.format(work.SumaEsqueletico)}`

            cell = row.insertCell(8)
            cell.classList.add('very-small-text')
            cell.classList.add('text-right')
            cell.innerHTML = `${moneyFormatter.format(work.SumaZirconio)}`

            cell = row.insertCell(9)
            cell.classList.add('very-small-text')
            cell.classList.add('text-right')
            cell.innerHTML = `${moneyFormatter.format(work.SumaFija)}`

            cell = row.insertCell(10)
            cell.classList.add('very-small-text')
            cell.classList.add('text-right')
            cell.innerHTML = `${moneyFormatter.format(work.SumaTotalMetal)}`

            cell = row.insertCell(11)
            cell.classList.add('very-small-text')
            cell = row.insertCell(12)
            cell.classList.add('very-small-text')
            cell = row.insertCell(13)
            cell.classList.add('very-small-text')
          })
        })
      } else {
        lastClickedRow = -1
      }
    },
    removeExtraRows(table) {
      for (var position = table.children.length - 1; position !== 0; position--) {
        if (table.children[position].className === 'deaggregated') {
          table.deleteRow(position)
        }
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
    })
  },
  mounted () {
  }
}
</script>