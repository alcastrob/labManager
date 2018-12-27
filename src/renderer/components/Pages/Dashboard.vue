<template>
  <div>
    <div class="container">
      <div class="row">
        <myIconCard :message="worksReceivedTodayCopy"
          filter="receivedToday"
          listHeading="Trabajos recibidos hoy"
          cssClass="bg-primary"
          icon="fas fa-tasks" />
        <myIconCard :message="worksSentTodayCopy"
          filter="receivedToday"
          listHeading="Trabajos que salen hoy"
          cssClass="bg-primary"
          icon="fas fa-tasks" />
      </div> <!-- row -->
      <div class="row">
        <div class="col-md-8 mt-2">
          <h1>Trabajos a la espera de entrada de prueba</h1>
          Trabajos
        </div>
      </div> <!-- row -->
      <div class="row">
        <div class="col-md-8 mt-2">
          <h1>Trabajos para salir</h1>
          Trabajos
        </div>
      </div> <!-- row -->
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
  computed: {
    worksReceivedTodayCopy: function() {
      if (this.inboundWorksToday > 1) {
        return this.inboundWorksToday + ' trabajos nuevos hoy'
      } else {
        return this.inboundWorksToday + ' trabajo nuevo hoy'
      }
    },
    worksSentTodayCopy : function() {
      if (this.inboundWorksToday > 1) {
        return this.inboundWorksToday + ' trabajos enviados hoy'
      } else {
        return this.inboundWorksToday + ' trabajo enviado hoy'
      }
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
