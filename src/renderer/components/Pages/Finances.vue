<template>
<div>
  <h1>
    Finanzas
  </h1>
<div>
    <div class="row">
      <myIconCard message="<count> trabajos en curso"
        cssClass="bg-primary"
        icon="fas fa-tasks"
        :dataset="worksInExecutionDataset"/>
      <myIconCard message="<count> trabajos cerrados en <month>"
        cssClass="bg-secondary"
        icon="fas fa-calendar-alt"
        :dataset="worksEndedThisMonth" />
      <myIconCard message="<count> trabajos cerrados en los últimos 30 días"
        secondMessage="<count> trabajos en el periodo anterior"
        cssClass="bg-info" icon="fas fa-chart-line"
        :dataset="worksEndedLast30days"
        :secondaryDataset="worksEndedPrevious30days" />
      <myIconCard message="<sum(Precio)> por trabajos cerrados en los últimos 30 días"
        secondMessage="<sum(Precio)> en el periodo anterior"
        cssClass="bg-success"
        icon="fas fa-euro-sign"
        :dataset="worksEndedLast30days"
        :secondaryDataset="worksEndedPrevious30days"/>
    </div>
  </div>
</div>
</template>

<script>
import myIconCard from '../PageElements/iconCards/myIconCard'
import { getWorkInExecution, getWorksEndedThisMonth, getWorksEndedLast30days, getWorksEndedPrevious30days } from '../../../main/dal.js'

export default {
  name: 'finances',
  components: { myIconCard },
    data () {
    return {
      worksInExecutionDataset: [],
      worksEndedThisMonth: [],
      worksEndedLast30days: [],
      worksEndedPrevious30days: []
    }
  },
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
</style>
