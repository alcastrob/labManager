<template>
  <div>
    <div class="container-fluid">
      <div class="row">
        <div class="col-md-4 mt-2">
          <div class="card">
            <div class="card-header">
              <i class="fas fa-sign-in-alt"></i>
              Trabajos a la espera de entrada de prueba
            </div>
            <div class="card-body">
              <transition-group name="animated-card">
                <div class="card p-2 animated-card" v-for="test in waitingInbound" v-bind:key="test.IdPrueba">
                  <div class="form-check" :class="{'card-disabled' : test.checked === true }" @click="changeCheckbox(test)">
                    <div>
                      <input class="form-check-input" type="checkbox" value="" v-model="test.checked">
                    </div>
                    <div>{{test.IdTrabajo}}&nbsp;|&nbsp;<span :title="test.NombreDentista">{{sumarizeText(test.NombreDentista, 20)}}</span></div>
                    <div class="badge-container pr-2">
                      <i class="fas fa-bookmark colored-badge" :class="{ 'fija-color': test.TipoTrabajo === 'Fija', 'resina-color': test.TipoTrabajo === 'Resina', 'ortodoncia-color': test.TipoTrabajo === 'Ortodoncia', 'esqueletico-color': test.TipoTrabajo === 'Esquelético', 'zirconio-color': test.TipoTrabajo === 'Zirconio', 'compostura-color': test.TipoTrabajo === 'Compostura', 'implante-color': test.TipoTrabajo === 'Implante' }" :title="test.TipoTrabajo"></i>
                    </div>
                    <div :title="test.Paciente">{{sumarizeText(test.Paciente, 28)}}</div>
                  </div>
                </div>
              </transition-group>
            </div> <!-- card-body -->
          </div> <!-- card -->
        </div> <!-- col-md-12 -->
        <div class="col-md-4 mt-2">
          <div class="card mb-3">
            <div class="card-header">
              <i class="fas fa-sign-out-alt"></i>
              Trabajos con pruebas que salen hoy
            </div>
            <div class="card-body">
              <h4>Por la mañana</h4>
              <div class="card p-2">
                <div class="form-check">
                  <div>
                  </div>
                  <div>12345&nbsp;|&nbsp;Clínica clínica clínica</div>
                  <div class="badge-container pr-2">
                    <i class="fas fa-bookmark colored-badge fija-color" title="Fija"></i>
                  </div>
                  <div>Paciente paciente paciente</div>
                </div>
              </div>
              <div class="card p-2">
                <div class="form-check">
                  <div>
                    <input class="form-check-input" type="checkbox" value="" id="defaultCheck1">
                  </div>
                  <div>12345&nbsp;|&nbsp;Clínica clínica clínica</div>
                  <div class="badge-container pr-2">
                    <i class="fas fa-bookmark colored-badge resina-color" title="Resina"></i>
                  </div>
                  <div>Paciente paciente paciente</div>
                </div>
              </div>
              <div class="card p-2">
                <div class="form-check">
                  <div>
                    <input class="form-check-input" type="checkbox" value="" id="defaultCheck1">
                  </div>
                  <div>12345&nbsp;|&nbsp;Clínica clínica clínica</div>
                  <div class="badge-container pr-2">
                    <i class="fas fa-bookmark colored-badge ortodoncia-color" title="Ortodoncia"></i>
                  </div>
                  <div>Paciente paciente paciente</div>
                </div>
              </div>
              <div class="card p-2">
                <div class="form-check">
                  <div>
                    <input class="form-check-input" type="checkbox" value="" id="defaultCheck1">
                  </div>
                  <div>12345&nbsp;|&nbsp;Clínica clínica clínica</div>
                  <div class="badge-container pr-2">
                    <i class="fas fa-bookmark colored-badge esqueletico-color" title="Esqueletico"></i>
                  </div>
                  <div>Paciente paciente paciente</div>
                </div>
              </div>
              <div class="card p-2">
                <div class="form-check">
                  <div>
                    <input class="form-check-input" type="checkbox" value="" id="defaultCheck1">
                  </div>
                  <div>12345&nbsp;|&nbsp;Clínica clínica clínica</div>
                  <div class="badge-container pr-2">
                    <i class="fas fa-bookmark colored-badge zirconio-color" title="Zirconio"></i>
                  </div>
                  <div>Paciente paciente paciente</div>
                </div>
              </div>
              <div class="card p-2">
                <div class="form-check">
                  <div>
                    <input class="form-check-input" type="checkbox" value="" id="defaultCheck1">
                  </div>
                  <div>12345&nbsp;|&nbsp;Clínica clínica clínica</div>
                  <div class="badge-container pr-2">
                    <i class="fas fa-bookmark colored-badge implante-color" title="Implante"></i>
                  </div>
                  <div>Paciente paciente paciente</div>
                </div>
              </div>
              <div class="card p-2">
                <div class="form-check">
                  <div>
                    <input class="form-check-input" type="checkbox" value="" id="defaultCheck1">
                  </div>
                  <div>12345&nbsp;|&nbsp;Clínica clínica clínica</div>
                  <div class="badge-container pr-2">
                    <i class="fas fa-bookmark colored-badge compostura-color" title="Compostura"></i>
                  </div>
                  <div>Paciente paciente paciente</div>
                </div>
              </div>
              <h4 class="mt-4">Por la tarde</h4>
              <div class="card p-2">
                <div class="form-check">
                  <div>
                    <input class="form-check-input" type="checkbox" value="" id="defaultCheck1">
                  </div>
                  <div>12345&nbsp;|&nbsp;Clínica clínica clínica</div>
                  <div class="badge-container pr-2">
                    <i class="fas fa-bookmark colored-badge fija-color" title="Fija"></i>
                  </div>
                  <div>Paciente paciente paciente</div>
                </div>
              </div>
              <div class="card p-2">
                <div class="form-check">
                  <div>
                    <input class="form-check-input" type="checkbox" value="" id="defaultCheck1">
                  </div>
                  <div>12345&nbsp;|&nbsp;Clínica clínica clínica</div>
                  <div class="badge-container pr-2">
                    <i class="fas fa-bookmark colored-badge resina-color" title="Resina"></i>
                  </div>
                  <div>Paciente paciente paciente</div>
                </div>
              </div>
            </div> <!-- card-body -->
            <div class="card-footer small text-muted">Hoy hay programados el envío de XX pruebas, de las cuales YY ya han sido enviadas.</div>
          </div> <!-- card -->
        </div> <!-- col-md-12 -->
        <div class="col-md-4 mt-2">
          <div class="card mb-3">
            <div class="card-header">
              <i class="fas fa-sign-out-alt"></i>
              Trabajos a finalizar hoy
            </div>
            <div class="card-body">
              <div class="card p-2">
                <div class="form-check">
                  <div>
                    <input class="form-check-input" type="checkbox" value="" id="defaultCheck1">
                  </div>
                  <div>12345&nbsp;|&nbsp;Clínica clínica clínica</div>
                  <div class="badge-container pr-2">
                    <i class="fas fa-bookmark colored-badge fija-color" title="Fija"></i>
                  </div>
                  <div>Paciente paciente paciente</div>
                </div>
              </div>
              <div class="card p-2">
                <div class="form-check">
                  <div>
                    <input class="form-check-input" type="checkbox" value="" id="defaultCheck1">
                  </div>
                  <div>12345&nbsp;|&nbsp;Clínica clínica clínica</div>
                  <div class="badge-container pr-2">
                    <i class="fas fa-bookmark colored-badge resina-color" title="Resina"></i>
                  </div>
                  <div>Paciente paciente paciente</div>
                </div>
              </div>
              <div class="card p-2">
                <div class="form-check">
                  <div>
                    <input class="form-check-input" type="checkbox" value="" id="defaultCheck1">
                  </div>
                  <div>12345&nbsp;|&nbsp;Clínica clínica clínica</div>
                  <div class="badge-container pr-2">
                    <i class="fas fa-bookmark colored-badge ortodoncia-color" title="Ortodoncia"></i>
                  </div>
                  <div>Paciente paciente paciente</div>
                </div>
              </div>
              <div class="card p-2">
                <div class="form-check">
                  <div>
                    <input class="form-check-input" type="checkbox" value="" id="defaultCheck1">
                  </div>
                  <div>12345&nbsp;|&nbsp;Clínica clínica clínica</div>
                  <div class="badge-container pr-2">
                    <i class="fas fa-bookmark colored-badge esqueletico-color" title="Esqueletico"></i>
                  </div>
                  <div>Paciente paciente paciente</div>
                </div>
              </div>
              <div class="card p-2">
                <div class="form-check">
                  <div>
                    <input class="form-check-input" type="checkbox" value="" id="defaultCheck1">
                  </div>
                  <div>12345&nbsp;|&nbsp;Clínica clínica clínica</div>
                  <div class="badge-container pr-2">
                    <i class="fas fa-bookmark colored-badge zirconio-color" title="Zirconio"></i>
                  </div>
                  <div>Paciente paciente paciente</div>
                </div>
              </div>
              <div class="card p-2">
                <div class="form-check">
                  <div>
                    <input class="form-check-input" type="checkbox" value="" id="defaultCheck1">
                  </div>
                  <div>12345&nbsp;|&nbsp;Clínica clínica clínica</div>
                  <div class="badge-container pr-2">
                    <i class="fas fa-bookmark colored-badge implante-color" title="Implante"></i>
                  </div>
                  <div>Paciente paciente paciente</div>
                </div>
              </div>
              <div class="card p-2">
                <div class="form-check">
                  <div>
                    <input class="form-check-input" type="checkbox" value="" id="defaultCheck1">
                  </div>
                  <div>12345&nbsp;|&nbsp;Clínica clínica clínica</div>
                  <div class="badge-container pr-2">
                    <i class="fas fa-bookmark colored-badge compostura-color" title="Compostura"></i>
                  </div>
                  <div>Paciente paciente paciente</div>
                </div>
              </div>
            </div> <!-- card-body -->
            <div class="card-footer small text-muted">Hoy han de finalizar XX trabajos, de los cuales ya han finalizado YY.</div>
          </div> <!-- card -->
        </div> <!-- col-md-12 -->
      </div> <!-- row -->
    </div> <!-- container -->
  </div>
</template>

<script>
import myIconCard from '../PageElements/iconCards/myIconCard'
import { getWaitingInbound, setInboundWorkTestToToday, unsetInboundTestToToday } from '../../../main/dal.js'
import _ from 'lodash'

export default {
  name: 'dashboard',
  components: { myIconCard },
  data () {
    return {
      waitingInbound: []
    }
  },
  methods: {
    sumarizeText: function(text, size) {
      if (text.length > size)
        return text.substring(0, size) + '...'
      else
        return text
    },
    changeCheckbox: async function(test){
      test.checked = !test.checked
      this.waitingInbound = _.sortBy(this.waitingInbound, (item) => {
        return [item.checked, item.NombreDentista, item.IdTrabajo]
      })

      if (test.checked === true){
        await setInboundWorkTestToToday(test.IdTrabajo)
      } else {
        await unsetInboundTestToToday(test.IdTrabajo)
      }
      this.$forceUpdate()
    },
    loadData: async function(){
      this.waitingInbound = await getWaitingInbound()
      for (var test of this.waitingInbound){
        test.checked = false
      }
    }
  },
  mounted () {
    this.loadData()
  },
  computed: {
    worksReceivedTodayCopy: function() {
      return 0
    },
    worksSentTodayCopy: function() {
      return 0
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

.animated-card {
  transition: all 0.5s;

}
.animated-card-enter, .animated-card-leave-to
/* .card-leave-active for <2.1.8 */ {
  opacity: 0;
  transform: scale(0);
}
.animated-card-enter-to {
  opacity: 1;
  transform: scale(1);
}

.card-move {
  opacity: 1;
  transition: all 0.5s;
}

.card-disabled {
  /* background-color: red; */
  color: #D8D8D8;
  text-decoration: line-through;

}

.badge-container {
  z-index: 1;
  height: 0px;
  text-align: right!important;
}

.colored-badge {
  position: relative;
  top: -32px;
  font-size: 20px;
  text-shadow: 2px 2px 3px #606060;
}

.fija-color {
  color: #F6F930;
}
.resina-color {
  color: #3B5BF9;
}
.ortodoncia-color {
  color: #CFFFCE;
}
.esqueletico-color {
  color: #F70027;
}
.zirconio-color {
  color: #CA787A;
}
.compostura-color {
  color: #4CFF40;
}
.implante-color {
  color: #ECD2D2;
}

</style>
