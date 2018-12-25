<template>
  <div>
    <div class="row">
      <myIconCard :message="worksReceivedTodayCopy()"
        filter="hh"
        listHeading="Trabajos recibidos hoy"
        cssClass="bg-primary"
        icon="fas fa-tasks" />
    </div>
  </div>
</template>

<script>
import topBar from '../PageElements/TopBar'
import myIconCard from '../PageElements/iconCards/myIconCard'
import { getInboundWorksToday } from '../../../main/dal.js'

export default {
  name: 'dashboard',
  components: { topBar, myIconCard },
  data () {
    return {
      inboundWorksToday: 0
    }
  },
  mounted () {
    getInboundWorksToday('labManager.sqlite').then((count) => {
      this.inboundWorksToday = count.Count
      })
  },
  methods: {
    worksReceivedTodayCopy: function() {
      return this.inboundWorksToday + ' trabajos recibidos hoy'
    }
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
