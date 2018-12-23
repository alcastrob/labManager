<template>
  <div>
    <div class="row">
      <myIconCard message="<count> trabajos recibidos hoy"
        cssClass="bg-primary"
        icon="fas fa-tasks"
        :dataset="inboundWorksToday"/>
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
      inboundWorksToday: []
    }
  },
  mounted () {
    getInboundWorksToday('labManager.sqlite').then((count) => {
      this.inboundWorksToday = count
      console.log(count)
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
