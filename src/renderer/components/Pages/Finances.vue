<template>
<div>
  <h1>Gestión Económica</h1>
  <div class="container-fluid">
    Pulse en cualquiera de estas tarjetas para obtener más detalles.
    <div class="row">
      <myIconCard :message="worksInProgress()"
        filter="inProgress"
        listHeading="Trabajos en curso"
        cssClass="bg-primary"
        icon="fas fa-tasks" />
      <myIconCard :message="worksEndedThisMonth()"
        filter="closedThisMonth"
        listHeading="Trabajos cerrados este mes"
        cssClass="bg-secondary"
        icon="fas fa-calendar-alt" />
      <myIconCard :message="worksCountEndedLast30Days()"
        :secondMessage="worksCountEndedPrevious30Days()"
        filter="closedLast30days"
        listHeading="Trabajos cerrados en los últimos 30 días"
        cssClass="bg-info" icon="fas fa-chart-line" />
      <myIconCard :message="worksSumEndedLast30Days()"
        :secondMessage="worksSumEndedPrevious30Days()"
        filter="closedLast30days"
        listHeading="Trabajos cerrados en los últimos 30 días"
        cssClass="bg-success"
        icon="fas fa-euro-sign" />
    </div> <!-- row -->
    <div class="row">
      <div class="col-md-8">
        <div class="card mt-3">
          <div class="card-header">
            <div class="row">
              <div class="col-md-6">
                <h3 class="pt-2">Facturas</h3>
              </div>
              <div class="col-md-6">
                <collapsibleExcelButton fileName="facturas" :isCollapsible="true" :collapsed="false" :isDark="true" class="float-right mt-2" ref="excelButton"></collapsibleExcelButton>
              </div>
            </div>
          </div>
          <div class="card-body">
            <invoiceExtendedTable :headers="headers" :searchFields="searchFields" ref="invoiceExtendedTable" urlBase="/finances/invoices/" masterKey="IdFactura">
            </invoiceExtendedTable>
          </div> <!-- card-body -->
        </div> <!-- card -->

      </div> <!-- col-md-8 -->
      <div class="col-md-4">
        <div class="card mt-3">
          <div class="card-header">
            <h3 class="pt-2">Evolución de ingresos</h3>
          </div>
          <div class="card-body">
            <canvas ref="incomeEvolution"></canvas>
          </div> <!-- card-body -->
        </div> <!-- card -->
        <div class="card mt-3">
          <div class="card-header">
            <h3 class="pt-2">Top 20 <span class="small">(Últimos 12 meses)</span></h3>
          </div>
          <div class="card-body" style="position: relative; height:420px;">
            <canvas ref="top20"></canvas>
          </div> <!-- card-body -->
        </div> <!-- card -->
        <div class="card mt-4">
          <div class="card-header">
            <h3 class="pt-2">Cierre de mes</h3>
          </div>
          <div class="card-body">
            Para realizar el cierre de un mes contable, seleccione la fecha y pulse el botón para ir a la página de cierre.
            <div class="row">
              <div class="col-md-6">
                <select class="form-control mt-3" ref="month">
                  <option disabled value="">Seleccione un mes</option>
                  <option value="1">enero</option>
                  <option value="2">febrero</option>
                  <option value="3">marzo</option>
                  <option value="4">abril</option>
                  <option value="5">mayo</option>
                  <option value="6">junio</option>
                  <option value="7">julio</option>
                  <option value="8">agosto</option>
                  <option value="9">septiembre</option>
                  <option value="10">octubre</option>
                  <option value="11">noviembre</option>
                  <option value="12">diciembre</option>
                </select>
              </div>
              <div class="col-md-6">
                <select class="form-control mt-3" ref="year">
                  <option disabled value="">Seleccione un año</option>
                  <option value="2019">2019</option>
                  <option value="2020">2020</option>
                  <option value="2021">2021</option>
                  <option value="2022">2022</option>
                  <option value="2023">2023</option>
                  <option value="2024">2024</option>
                  <option value="2025">2025</option>
                </select>
              </div>
            </div>
            <button type="button" class="btn btn-secondary btn-block mt-4" @click="gotoMonthCheck" >Ir a página de cierre</button>
          </div> <!-- card-body -->
        </div> <!-- card -->
      </div> <!-- col-md-4 -->
    </div> <!-- row -->
  </div>
</div>
</template>

<script>
import myIconCard from '../PageElements/iconCards/myIconCard'
import { getWorkInExecution, getWorksEndedThisMonth, getWorksEndedLast30days, getWorksEndedPrevious30days, getInvoicesList, getMonthTotals, getLeaderboard } from '../../../main/dal.js'
import invoiceExtendedTable from '../PageElements/tables/invoiceExtendedTable'
import _ from 'lodash'
import collapsibleExcelButton from '../PageElements/CollapsibleButtons/collapsibleExcelButton'

export default {
  name: 'finances',
  components: {
    myIconCard,
    invoiceExtendedTable,
    collapsibleExcelButton
  },
  data () {
    return {
      worksInProgressCount: 0,
      worksEndedThisMonthCount: 0,
      worksEndedLast30daysCount: 0,
      worksEndedLast30daySum: 0,
      worksEndedPrevious30daysCount: 0,
      worksEndedPrevious30daysSum: 0,
      moneyFormatter: new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'EUR'
      }),
      headers: [ {
          title: 'Nº Factura',
          dataField: 'NumFactura',
          titleClass: 'text-left',
          rowClass: ''
        }, {
          title: 'Dentista',
          dataField: 'NombreDentista',
          titleClass: 'text-left',
          rowClass: ''
        }, {
          title: 'Fecha Factura',
          dataField: 'Fecha',
          titleClass: 'text-right',
          rowClass: 'text-right',
          formatter: 'date'
        }, {
          title: 'Total',
          dataField: 'Total',
          titleClass: 'text-right',
          rowClass: 'text-right',
          formatter: 'money'
        } ],
      searchFields: ['NumFactura', 'NombreDentista'],
      expenseEvolutionChart: {},
      yearsExpenseEvolutionChart: [],
      top20Chart: {}
    }
  },
  methods: {
    worksInProgress: function() {
      return this.worksInProgressCount + ' trabajos en curso'
    },
    worksEndedThisMonth: function() {
      return this.worksEndedThisMonthCount + ' trabajos cerrados en ' + new Date().toLocaleString('es-es', { month: 'long' });
    },
    worksCountEndedLast30Days: function() {
      return this.worksEndedLast30daysCount + ' trabajos cerrados en los últimos 30 días'
    },
    worksSumEndedLast30Days: function() {
      return this.moneyFormatter.format(this.worksEndedLast30daysSum) + ' por trabajos cerrados en los últimos 30 días'
    },
    worksCountEndedPrevious30Days: function() {
      return this.worksEndedPrevious30daysCount + ' trabajos cerrados en los 30 días previos'
    },
    worksSumEndedPrevious30Days: function() {
      return this.moneyFormatter.format(this.worksEndedPrevious30daysSum) + ' por trabajos cerrados en los 30 días previos'
    },
    gotoMonthCheck: function() {
      var path = `/finances/monthCheck/${this.$refs.year.selectedOptions[0].value}/${this.$refs.month.selectedOptions[0].value}`
      this.$router.push({
        path: path
      })
    },
    updateDatasetWithFilters: async function (eventData) {
      this.$refs.invoiceExtendedTable.setDataset(await getInvoicesList(eventData))
    },
    processFilterChange(filterData) {
      this.updateDatasetWithFilters(filterData)
    },
    loadData: async function() {
      this.updateDatasetWithFilters()
      this.worksInProgressCount = (await getWorkInExecution()).Count
      this.worksEndedThisMonthCount = (await getWorksEndedThisMonth()).Count
      var works = await getWorksEndedLast30days()
      this.worksEndedLast30daysCount = works.Count
      this.worksEndedLast30daysSum = works.Sum
      works = await getWorksEndedPrevious30days()
      this.worksEndedPrevious30daysCount = works.Count
      this.worksEndedPrevious30daysSum = works.Sum
      this.$refs.invoiceExtendedTable.setFilter(this.$route.query.dentistName)
    },
    loadGraph: async function() {
      var dataMonths = await getMonthTotals()
      var leaderboardData = await getLeaderboard(20)

      this.yearsExpenseEvolutionChart = [new Date().getFullYear(), new Date().getFullYear() - 1]

      var barChartData = {
        labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto','Septiembre', 'Octobre', 'Noviembre', 'Diciembre'],
        datasets: [{
          label: this.yearsExpenseEvolutionChart[0],
          backgroundColor: 'rgba(247, 146, 86, .8)',
          borderColor: 'rgba(247, 146, 86, 1)',
          borderWidth: 1,
          data: dataMonths.thisYear
        }, {
          label: this.yearsExpenseEvolutionChart[1],
          backgroundColor: 'rgba(93, 169, 233, .8)',
          borderColor: 'rgba(93, 169, 233, 1)',
          borderWidth: 1,
          data: dataMonths.lastYear
        }]
      }

      var leaderboardChartData = {
        labels: _.map(leaderboardData, 'NombreDentista'),
        datasets: [{
          label: new Date().getFullYear(),
          backgroundColor: 'rgba(23, 162, 184, .8)',
          borderColor: 'rgba(23, 162, 184, 1)',
          borderWidth: 1,
          data: _.map(leaderboardData, 'Sum')
        }]
      }

      var ctxIncomeEvolution = this.$refs.incomeEvolution.getContext('2d')
      var ctxLeaderboard = this.$refs.top20.getContext('2d')

      this.expenseEvolutionChart = new Chart(ctxIncomeEvolution, {
        type: 'bar',
        data: barChartData,
        options: {
          responsive: true,
          legend: {
            position: 'bottom',
          },
          title: {
            display: false,
          },
          tooltips: {
            callbacks: {
              label: this.setExpenseEvolutionTooltip
            }
          }
        }
      })
      this.top20Chart = new Chart(ctxLeaderboard, {
        type: 'horizontalBar',
        data: leaderboardChartData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          legend: {
            display: false
          },
          title: {
            display: false,
          },
          tooltips: {
            callbacks: {
              label: this.setLeaderboardTooltip
            }
          }
        }
      })
    },
    setExpenseEvolutionTooltip(tooltipItem) {
      return `${tooltipItem.xLabel} ${this.yearsExpenseEvolutionChart[tooltipItem.datasetIndex]}: ${this.moneyFormatter.format(tooltipItem.yLabel)}`
    },
    setLeaderboardTooltip(tooltipItem){
      return `${tooltipItem.yLabel}: ${this.moneyFormatter.format(tooltipItem.xLabel)}`
    }
  },
  activated() {
    this.loadData()
  },
  mounted() {
    this.loadGraph()
    this.$refs.excelButton.setTable(this.$refs.invoiceExtendedTable)
    // this.$refs.excelButton.setEnablePaginationCallback(this.$refs.invoiceExtendedTable.enablePagination)
    // this.$refs.excelButton.setDisablePaginationCallback(this.$refs.invoiceExtendedTable.disablePagination)
  }
}
</script>
<style>
  canvas {
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
  }
</style>