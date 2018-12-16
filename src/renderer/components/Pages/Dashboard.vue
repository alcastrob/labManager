<template>
  <div>
    <div class="row">
      <myIconCard message="<count> trabajos en curso" cssClass="bg-primary" icon="fas fa-tasks" :rawData="worksInExecutionDataset"/>
      <myIconCard message="<count> trabajos cerrados este mes" cssClass="bg-secondary" icon="fas fa-calendar-alt" :rawData="worksEndedThisMonth" />
      <myIconCard
      message="<count> trabajos cerrados en los últimos 30 días"
      secondMessage="<count> trabajos en el periodo anterior"
      cssClass="bg-info" icon="fas fa-chart-line"
      :rawData="worksEndedLast30days"
      :secondaryRawData="worksEndedPrevious30days" />
      <myIconCard message="<sum(Precio)> por los trabajos cerrados en los últimos 30 días" secondMessage="<sum(Precio)> en el periodo anterior" cssClass="bg-success" icon="fas fa-euro-sign" :rawData="worksEndedLast30days" :secondaryRawData="worksEndedPrevious30days"/>
    </div>
    <areaChart/>
    <workList/>
  </div>
</template>

<script>
import topBar from '../PageElements/TopBar'
import myIconCard from '../PageElements/iconCards/myIconCard'
import areaChart from '../PageElements/AreaChart'
import workList from '../PageElements/WorkList'
import { getWorkInExecution, getWorksEndedThisMonth, getWorksEndedLast30days, getWorksEndedPrevious30days } from '../../../main/dal.js'

export default {
  name: 'dashboard',
  components: { topBar, myIconCard, areaChart, workList},
  data () {
    return {
      worksInExecutionDataset: [],
      worksEndedThisMonth: [],
      worksEndedLast30days: [],
      worksEndedPrevious30days: []
    }
  },
  methods: {},
  mounted () {
    getWorkInExecution('labManager.sqlite').then((works) => {
      this.worksInExecutionDataset = works
      })
    getWorksEndedThisMonth('labManager.sqlite').then((works) => {
      this.worksEndedThisMonth = works
      })
    getWorksEndedLast30days('labManager.sqlite').then((works) => {
      this.worksEndedLast30days = works
      })
    getWorksEndedPrevious30days('labManager.sqlite').then((works) => {
      this.worksEndedPrevious30days = works
      })
  }
}
</script>

<style>
#wrapper {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
}

#wrapper #content-wrapper {
  overflow-x: hidden;
  width: 100%;
  padding-top: 1rem;
  padding-bottom: 80px;
}

body.fixed-nav #content-wrapper {
  margin-top: 56px;
  padding-left: 90px;
}

body.fixed-nav.sidebar-toggled #content-wrapper {
  padding-left: 0;
}

@media (min-width: 768px) {
  body.fixed-nav #content-wrapper {
    padding-left: 225px;
  }
  body.fixed-nav.sidebar-toggled #content-wrapper {
    padding-left: 90px;
  }
}
</style>
