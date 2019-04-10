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
                <div
                  class="card p-2 animated-card"
                  v-for="test in waitingInbound"
                  v-bind:key="'a' + test.IdPrueba"
                >
                  <div
                    class="form-check"
                    :class="{'card-disabled' : test.checked === true }"
                    @click="changeCheckbox(test)"
                  >
                    <div>
                      <input class="form-check-input" type="checkbox" v-model="test.checked">
                    </div>
                    <div>
                      {{test.IdTrabajo}}&nbsp;|&nbsp;
                      <span
                        :title="test.NombreDentista"
                      >{{sumarizeText(test.NombreDentista, 20)}}</span>
                    </div>
                    <div class="badge-container pr-2">
                      <i
                        class="fas fa-bookmark colored-badge"
                        :class="{ 'fija-color': test.TipoTrabajo === 'Fija', 'resina-color': test.TipoTrabajo === 'Resina', 'ortodoncia-color': test.TipoTrabajo === 'Ortodoncia', 'esqueletico-color': test.TipoTrabajo === 'Esquelético', 'zirconio-color': test.TipoTrabajo === 'Zirconio', 'compostura-color': test.TipoTrabajo === 'Compostura', 'implante-color': test.TipoTrabajo === 'Implante' }"
                        :title="test.TipoTrabajo"
                      ></i>
                    </div>
                    <div :title="test.Paciente">{{sumarizeText(test.Paciente, 28)}}</div>
                  </div>
                </div>
              </transition-group>
            </div>
            <!-- card-body -->
          </div>
          <!-- card -->
        </div>
        <!-- col-md-12 -->
        <div class="col-md-4 mt-2">
          <div class="card mb-3">
            <div class="card-header">
              <i class="fas fa-sign-out-alt"></i>
              Trabajos con pruebas que salen hoy
            </div>
            <div class="card-body">
              <transition-group name="animated-card">
                <div
                  class="card p-2 animated-card"
                  v-for="(test, idx) in outboundTests"
                  v-bind:key="'b' + idx"
                >
                  <div class="form-check" @click="redirectToWork(test.IdTrabajo)">
                    <span>{{test.IdTrabajo}}&nbsp;|&nbsp;</span>
                    <span :title="test.NombreDentista">{{sumarizeText(test.NombreDentista, 25)}}</span>
                    <div class="badge-container pr-2">
                      <i
                        class="fas fa-bookmark colored-badge"
                        :class="{ 'fija-color': test.TipoTrabajo === 'Fija', 'resina-color': test.TipoTrabajo === 'Resina', 'ortodoncia-color': test.TipoTrabajo === 'Ortodoncia', 'esqueletico-color': test.TipoTrabajo === 'Esquelético', 'zirconio-color': test.TipoTrabajo === 'Zirconio', 'compostura-color': test.TipoTrabajo === 'Compostura', 'implante-color': test.TipoTrabajo === 'Implante' }"
                        :title="test.TipoTrabajo"
                      ></i>
                    </div>
                    <div :title="test.Paciente">{{sumarizeText(test.Paciente, 28)}}</div>
                  </div>
                </div>
              </transition-group>
            </div>
            <!-- card-body -->
          </div>
          <!-- card -->
        </div>
        <!-- col-md-12 -->
        <div class="col-md-4 mt-2">
          <div class="card mb-3">
            <div class="card-header">
              <i class="fas fa-sign-out-alt"></i>
              Trabajos a finalizar en los próximos días
            </div>
            <div class="card-body">
              <div
                class="pb-3"
                v-for="date in outboundWorks"
                v-bind:key="'c' + date[0].FechaPrevista"
              >
                <h4>{{format(date[0].FechaPrevista)}}</h4>
                <transition-group name="animated-card">
                  <div
                    class="card p-2 animated-card"
                    v-for="(test, idx) in date"
                    v-bind:key="'d' + idx"
                  >
                    <div class="form-check" @click="redirectToWork(test.IdTrabajo)">
                      <span>{{test.IdTrabajo}}&nbsp;|&nbsp;</span>
                      <span :title="test.NombreDentista">{{sumarizeText(test.NombreDentista, 25)}}</span>
                      <div class="badge-container pr-2">
                        <i
                          class="fas fa-bookmark colored-badge"
                          :class="{ 'fija-color': test.TipoTrabajo === 'Fija', 'resina-color': test.TipoTrabajo === 'Resina', 'ortodoncia-color': test.TipoTrabajo === 'Ortodoncia', 'esqueletico-color': test.TipoTrabajo === 'Esquelético', 'zirconio-color': test.TipoTrabajo === 'Zirconio', 'compostura-color': test.TipoTrabajo === 'Compostura', 'implante-color': test.TipoTrabajo === 'Implante' }"
                          :title="test.TipoTrabajo"
                        ></i>
                      </div>
                      <div :title="test.Paciente">{{sumarizeText(test.Paciente, 28)}}</div>
                    </div>
                  </div>
                </transition-group>
              </div>
            </div>
            <!-- card-body -->
          </div>
          <!-- card -->
        </div>
        <!-- col-md-12 -->
      </div>
      <!-- row -->
    </div>
    <!-- container -->
    <b-modal
      ref="endDateModal"
      :title="modalTitle"
      hide-footer
      no-close-on-backdrop
      no-close-on-esc
      hide-header-close
    >
      <div class="modal-body">
        <span>Al recibir de vuelta una prueba, hay que establecer una nueva fecha prevista de prueba.</span>
        <input
          type="date"
          class="form-control mt-3"
          ref="nuevaFechaPrevistaPrueba"
          placeholder="dd/mm/aaaa"
          @change="enableBtnSetNewDate"
          @blur="enableBtnSetNewDate"
        >
      </div>
      <div class="modal-footer mt-3">
        <button
          class="btn btn-secondary"
          :disabled="isDisabledSaveButton()"
          @click="btnSetNewDateClick"
          ref="btnSetNewDate"
        >
          <i class="fas fa-save mr-2 position-relative" style="top: 1px;"></i>Aceptar
        </button>
        <!-- isDisabledSaveButton() -->
      </div>
    </b-modal>
  </div>
</template>

<script>
import myIconCard from '../PageElements/iconCards/myIconCard'
import DashboardService from '../../../services/DashboardService'
import WorkService from '../../../services/WorkService'
import WorkTestService from '../../../services/WorkTestService'
import _ from 'lodash'
import moment from 'moment'
// eslint-disable-next-line
import bModal from 'bootstrap-vue'
import log from 'loglevel'

export default {
	name: 'dashboard',
	components: { myIconCard },
	data() {
		return {
			waitingInbound: [],
			outboundTests: [],
			outboundWorks: [],
			currentTest: {}
		}
	},
	methods: {
		sumarizeText: function(text, size) {
			if (text.length > size) {
				return text.substring(0, size) + '...'
			} else {
				return text
			}
		},
		changeCheckbox: async function(test) {
			if (!test.checked) {
				this.currentTest = test
				this.$refs.nuevaFechaPrevistaPrueba.value = ''
				this.$refs.endDateModal.show()
			}
			test.checked = !test.checked
			this.waitingInbound = _.sortBy(this.waitingInbound, item => {
				return [item.checked, item.NombreDentista, item.IdTrabajo]
			})

			if (test.checked === true) {
				await this.workTestService.setInboundWorkTestToToday(test.IdTrabajo)
			} else {
				await this.workTestService.unsetInboundTestToToday(test.IdTrabajo)
			}
			this.$forceUpdate()
		},
		enableBtnSetNewDate: function() {
			if (this.$refs.btnSetNewDate !== undefined) {
				this.$refs.btnSetNewDate.disabled = this.isDisabledSaveButton()
			}
		},
		btnSetNewDateClick: async function() {
			var workToUpdate = await this.workService.getWork(this.currentTest.IdTrabajo)
			workToUpdate.FechaPrevista = this.$refs.nuevaFechaPrevistaPrueba.value
			await this.workService.updateWork(workToUpdate)

			this.$refs.endDateModal.hide()
		},
		redirectToWork: function(workId) {
			log.info(`>> navigate: /works/details/${workId}`)
			this.$router.push({ path: `/works/details/${workId}` })
		},
		format(date) {
			var startOfToday = moment().startOf('day')
			var startOfDate = moment(date).startOf('day')
			var daysDiff = startOfDate.diff(startOfToday, 'days')

			switch (daysDiff) {
				case 0:
					return 'Hoy'
				case 1:
					return 'Mañana'
				case 2:
					return 'Pasado mañana'
				case 3:
					return 'En tres días'
			}
		},
		isDisabledSaveButton: function() {
			if (this.$refs.nuevaFechaPrevistaPrueba === undefined) {
				return true
			} else {
				return this.$refs.nuevaFechaPrevistaPrueba.value === '' || !this.$refs.nuevaFechaPrevistaPrueba.validity.valid
			}
		},
		loadData: async function() {
			this.waitingInbound = await this.dashboardService.getWaitingInbound()
			for (var test of this.waitingInbound) {
				test.checked = false
			}
			this.outboundTests = await this.dashboardService.getOutboundingTests()
			this.outboundWorks = _.groupBy(await this.dashboardService.getOutboundingWorks(), o => {
				return o.FechaPrevista
			})
		}
	},
	computed: {
		modalTitle: function() {
			if (this.currentTest.IdTrabajo === undefined) {
				return ''
			} else {
				return `Trabajo ${this.currentTest.IdTrabajo} | ${this.sumarizeText(
					this.currentTest.NombreDentista,
					20
				)} | ${this.sumarizeText(this.currentTest.Paciente, 20)}`
			}
		}
	},
	created() {
    this.dashboardService = new DashboardService()
    this.workService = new WorkService()
		this.workTestService = new WorkTestService()
	},
	mounted() {
		this.loadData()
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
	color: #d8d8d8;
	text-decoration: line-through;
}

.badge-container {
	z-index: 1;
	height: 0px;
	text-align: right !important;
}

.colored-badge {
	position: relative;
	top: -32px;
	font-size: 20px;
	text-shadow: 2px 2px 3px #606060;
}

.fija-color {
	color: #f6f930;
}
.resina-color {
	color: #3b5bf9;
}
.ortodoncia-color {
	color: #cfffce;
}
.esqueletico-color {
	color: #f70027;
}
.zirconio-color {
	color: #ca787a;
}
.compostura-color {
	color: #4cff40;
}
.implante-color {
	color: #ecd2d2;
}
</style>
