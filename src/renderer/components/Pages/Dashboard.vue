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
              <draggable v-model="myArray" :move="checkMove" v-on:start="start" v-on:end="end">
                <transition-group>
                  <div class="card p-2" v-for="test in waitingInbound" v-bind:key="test.IdPrueba">
                    <div class="form-check">
                      <div>
                        <input class="form-check-input" type="checkbox" value="">
                      </div>
                      <div>{{test.IdTrabajo}}&nbsp;|&nbsp;{{test.NombreDentista}}</div>
                      <div class="badge-container pr-2">
                        <i class="fas fa-bookmark colored-badge" :class="{ 'fija-color': test.TipoTrabajo === 'Fija', 'resina-color': test.TipoTrabajo === 'Resina', 'ortodoncia-color': test.TipoTrabajo === 'Ortodoncia', 'esqueletico-color': test.TipoTrabajo === 'Esquelético', 'zirconio-color': test.TipoTrabajo === 'Zirconio', 'compostura-color': test.TipoTrabajo === 'Compostura', 'implante-color': test.TipoTrabajo === 'Implante' }" :title="test.TipoTrabajo"></i>
                      </div>
                      <div>{{test.Paciente}}</div>
                    </div>
                  </div>
                </transition-group>
              </draggable>
            </div> <!-- card-body -->
            <div class="card-footer small text-muted">Hoy se espera el retorno de XX pruebas, de las cuales se han recepcionado YY.</div>
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
import { getWaitingInbound } from '../../../main/dal.js'
import draggable from 'vuedraggable'

export default {
  name: 'dashboard',
  components: { myIconCard, draggable },
  data () {
    return {
      waitingInbound: [],
      myArray: []
    }
  },
  methods: {
    checkMove: function(a, b, c) {
      return true
    },
    start: function (event) {
      event.item.classList.add('darkborder')
    },
    end: function (event){
      event.item.classList.remove('darkborder')
    },
    loadData: async function(){
      this.waitingInbound = await getWaitingInbound()
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

.badge-container {
  z-index: 1;
  height: 0px;
  text-align: right!important;
}

.colored-badge {
  position: relative;
  top: -32px;
  font-size: 20px;
  /* -webkit-text-stroke-width: 1px;
  -webkit-text-stroke-color: #A0A0A0; */
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

.darkborder {
  border: 1px solid #999999;
  background-color: #E5F1F9;
}
</style>
