<template>
  <div class="table-responsive">
    <float-thead-table class="table table-bordered" :top="56">
      <thead>
        <tr>
          <th v-for="header in headers" v-bind:key="header.dataField"
            v-bind:class="header.titleClass">
            {{header.title}}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rawDataset" v-bind:key="row[0]"
        v-on:click="toggleExtraData($event, row['Key'])">
          <template v-for="column in headers">
            <td v-bind:key="column.dataField" v-bind:class="column.rowClass">
              <span>
                {{formatRow(row[column.dataField], column.formatter)}}
              </span>
              <span></span>
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
      lastClickedRow: -1
    }
  },
  methods: {
    setFilters: function(filterName) {
      this.$refs.filterBar.setFilterName(filterName)
    },
    processFilterChange(filterData) {
      this.$parent.processFilterChange(filterData)
    },
    toggleExtraData(event, idDentist, b) {
      console.log(idDentist)
      var table = event.currentTarget.parentElement
      var clickedRowOrder = event.currentTarget.rowIndex

      this.removeExtraRows(table)
      if (this.lastClickedRow !== clickedRowOrder) {
        this.lastClickedRow = clickedRowOrder
        getWorksDeaggregatedByDentist(parseInt(this.year), parseInt(this.month), idDentist, 'labManager.sqlite').then((workDetails) => {
          var moneyFormatter = new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'EUR'
          })
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
        this.lastClickedRow = -1
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
    })
  },
  mounted () {
  }
}
</script>

<style>

</style>
