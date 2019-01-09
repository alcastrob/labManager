<template>
<div>
  <h1>
    Finanzas
  </h1>
<div>
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
    </div>
    <div class="row">
      <router-link to="/finances/monthCheck/2018/2" class="nav-link" role="button">
      Cierre de mes
      </router-link>
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
      worksInProgressCount: 0,
      worksEndedThisMonthCount: 0,
      worksEndedLast30daysCount: 0,
      worksEndedLast30daySum: 0,
      worksEndedPrevious30daysCount: 0,
      worksEndedPrevious30daysSum: 0,
      moneyFormatter: new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'EUR'
      })
    }
  },
  mounted () {
    getWorkInExecution('labManager.sqlite').then((works) => {
      this.worksInProgressCount = works.Count
      })
    getWorksEndedThisMonth('labManager.sqlite').then((works) => {
      this.worksEndedThisMonthCount = works.Count
      })
    getWorksEndedLast30days('labManager.sqlite').then((works) => {
      this.worksEndedLast30daysCount = works.Count
      this.worksEndedLast30daysSum = works.Sum
      })
    getWorksEndedPrevious30days('labManager.sqlite').then((works) => {
      this.worksEndedPrevious30daysCount = works.Count
      this.worksEndedPrevious30daysSum = works.Sum
      })
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
    }
  }
}
</script>
