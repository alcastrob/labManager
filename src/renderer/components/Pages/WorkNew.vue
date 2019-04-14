<template>
  <div>
    <div class="container">
      <div class="row">
        <div class="col-md-6">
          <h1>Nuevo Trabajo</h1>
        </div>
        <!-- col-md-6 -->
        <div class="col-md-6 mt-2">
          <div class="float-right">
            <div>
              <collapsible-action-button
                iconCss="fas fa-map-pin"
                text="Aditamentos"
                :callback="showAdjunts"
                v-if="!adjunctsVisible"
              ></collapsible-action-button>
            </div>
          </div>
        </div>
      </div>
      <!-- row -->
      <div class="row">
        <div class="col-md-12">
          <div class="row">
            <div class="col-md-6 mb-3 mt-3">
              <label for="clinica">Clínica o Dr/a</label>
              <dentist-search
                id="clinica"
                ref="clinica"
                v-model="$v.work.IdDentista.$model"
                :isInvalid="$v.work.IdDentista.$error && saveButtonPressed"
                @change="$refs.paciente.focus()"
              ></dentist-search>
              <small
                class="text-danger"
                v-if="$v.work.IdDentista.$error && saveButtonPressed"
              >Es necesario especificar una clínica o dr/a.</small>
            </div>
            <!-- col-md-6 -->
            <div class="col-md-6 mt-3">
              <label for="paciente">Paciente</label>
              <input
                type="text"
                class="form-control"
                v-model="$v.work.Paciente.$model"
                ref="paciente"
              >
            </div>
            <!-- col-md-6 -->
            <div class="col-md-3">
              <label for="tipoTrabajo">Tipo trabajo</label>
              <select
                class="form-control"
                id="tipoTrabajo"
                ref="tipoTrabajo"
                v-model="$v.work.IdTipoTrabajo.$model"
                :class="{'is-invalid': $v.work.IdTipoTrabajo.$error}"
              >
                <option disabled value>Seleccione una opción</option>
                <option
                  v-for="type in workTypes"
                  v-bind:key="type.IdTipoTrabajo"
                  v-bind:value="type.IdTipoTrabajo"
                >{{type.Descripcion}}</option>
              </select>
              <small
                class="text-danger"
                v-if="$v.work.IdTipoTrabajo.$error && saveButtonPressed"
              >Es necesario especificar un tipo de trabajo.</small>
            </div>
            <!-- col-md-6 -->
            <div class="col-md-2">
              <label for="precioMetal">Precio metal</label>
              <input
                type="text"
                class="form-control"
                id="precioMetal"
                ref="precioMetal"
                placeholder="€"
                v-model="$v.work.PrecioMetal.$model"
                :class="{'is-invalid': $v.work.PrecioMetal.$error}"
              >
              <small
                class="text-danger"
                v-if="$v.work.PrecioMetal.$error"
              >Aunque opcional, se requiere que el precio del metal sea válido</small>
            </div>
            <!-- col-md-2 -->
            <div class="col-md-4">
              <label for="color">Color</label>
              <input
                type="text"
                class="form-control"
                id="color"
                placeholder="Indique el color"
                v-model="$v.work.Color.$model"
              >
            </div>
            <!-- col-md-4 -->
          </div>
          <!-- row -->
        </div>
        <!-- col-md-12 -->
      </div>
      <!-- row -->
      <div class="row">
        <div class="col-md-12 mt-3">
          <h4>Indicaciones</h4>
          <workIndicationsTable v-model="workIndications" ref="workIndications"></workIndicationsTable>
        </div>
        <!-- col-md-12 -->
      </div>
      <!-- row -->
      <div class="row">
        <div class="col-md-4 mt-3">
          <label for="fEntrada">Fecha entrada</label>
          <input
            type="date"
            class="form-control"
            id="fEntrada"
            placeholder="dd/mm/aaaa"
            v-model="$v.work.FechaEntrada.$model"
          >
        </div>
        <!-- col-md-4 -->
        <div class="col-md-4 mt-3">
          <label for="fPrevista">Fecha prevista prueba</label>
          <input
            type="date"
            class="form-control"
            id="fPrevistaPrueba"
            placeholder="dd/mm/aaaa"
            v-model="$v.work.FechaPrevistaPrueba.$model"
          >
        </div>
        <!-- col-md-4 -->
        <div class="col-md-4 mt-3">
          <label for="fPrevista">Fecha prevista terminación</label>
          <input
            type="date"
            class="form-control"
            id="fPrevista"
            placeholder="dd/mm/aaaa"
            v-model="$v.work.FechaPrevista.$model"
          >
        </div>
        <!-- col-md-4 -->
      </div>
      <!-- row -->
      <div class="row">
        <div class="col-md-12 mt-4">
          <workAdjuncts v-model="workAdjuncts" v-if="adjunctsVisible"></workAdjuncts>
        </div>
        <!-- col-md-12 -->
      </div>
      <!-- row -->
      <div class="row">
        <div class="col-md-12 mt-3">
          <button class="btn btn-secondary btn-block" v-on:click="save()">
            <i class="fas fa-save"></i>
            Guardar
          </button>
        </div>
        <!-- col-md-12 -->
      </div>
      <!-- row -->
    </div>
    <!-- container -->
    <b-modal
      ref="printLabelModal"
      size="lg"
      title="Imprimir etiquetas"
      hide-footer
      @hidden="goBack"
    >
      <div class="modal-body">
        <div class="containter">
          <div class="row">
            <label
              for="labelText"
            >Al dar de alta un nuevo trabajo se pueden imprimir múltiples etiquetas de una vez. Seleccione las que vaya a necesitar en la lista de la izquierda, edite (si lo cree necesario) el texto a la derecha y pulse el botón Imprimir.</label>
          </div>
          <div class="row pt-4">
            <div class="col-md-3">
              <div class="form-check">
                <input
                  class="form-check-input"
                  id="cbResina"
                  type="checkbox"
                  ref="cbResina"
                  @change="setBtnPrintEnabled"
                >
                <label class="form-check-label" for="cbResina">Resina</label>
              </div>
              <div class="form-check">
                <input
                  class="form-check-input"
                  id="cbCompostura"
                  type="checkbox"
                  ref="cbCompostura"
                  @change="setBtnPrintEnabled"
                >
                <label class="form-check-label" for="cbCompostura">Compostura</label>
              </div>
              <div class="form-check" v-if="adjunctsVisible">
                <input
                  class="form-check-input"
                  id="cbAditamentos"
                  type="checkbox"
                  ref="cbAditamentos"
                  @change="setBtnPrintEnabled"
                >
                <label class="form-check-label" for="cbAditamentos">Aditamentos</label>
              </div>
              <div class="form-check">
                <input
                  class="form-check-input"
                  id="cbEsqueletico"
                  type="checkbox"
                  ref="cbEsqueletico"
                  @change="setBtnPrintEnabled"
                >
                <label class="form-check-label" for="cbEsqueletico">Esqueléticos</label>
              </div>
              <div class="form-check">
                <input
                  class="form-check-input"
                  id="cbOrtodoncia"
                  type="checkbox"
                  ref="cbOrtodoncia"
                  @change="setBtnPrintEnabled"
                >
                <label class="form-check-label" for="cbOrtodoncia">Ortodoncia</label>
              </div>
            </div>
            <div class="col-md-3">
              <div class="form-check">
                <input
                  class="form-check-input"
                  id="cbZirconio"
                  type="checkbox"
                  ref="cbZirconio"
                  @change="setBtnPrintEnabled"
                >
                <label class="form-check-label" for="cbZirconio">Zirconio</label>
              </div>
              <div class="form-check">
                <input
                  class="form-check-input"
                  id="cbImplantes"
                  type="checkbox"
                  ref="cbImplantes"
                  @change="setBtnPrintEnabled"
                >
                <label class="form-check-label" for="cbImplantes">Implantes</label>
              </div>
              <div class="form-check">
                <input
                  class="form-check-input"
                  id="cbEmax"
                  type="checkbox"
                  ref="cbEmax"
                  @change="setBtnPrintEnabled"
                >
                <label class="form-check-label" for="cbEmax">E-Max</label>
              </div>
              <div class="form-check">
                <input
                  class="form-check-input"
                  id="cbComposite"
                  type="checkbox"
                  ref="cbComposite"
                  @change="setBtnPrintEnabled"
                >
                <label class="form-check-label" for="cbComposite">Composite</label>
              </div>
              <div class="form-check">
                <input
                  class="form-check-input"
                  id="cbMetalCeramica"
                  type="checkbox"
                  ref="cbMetalCeramica"
                  @change="setBtnPrintEnabled"
                >
                <label class="form-check-label" for="cbMetalCeramica">Metal-Cerámica</label>
              </div>
            </div>
            <div class="col-md-6">
              <textarea
                class="form-control"
                id="labelText"
                rows="5"
                cols="50"
                v-model="workIndicationsText"
              ></textarea>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" @click="hideModal">No imprimir nada</button>
        <button class="btn btn-secondary" @click="printLabels" disabled ref="btnPrint">
          <i class="fas fa-print mr-2 position-relative" style="top: 1px;"></i>Imprimir
        </button>
      </div>
    </b-modal>
    <div ref="labelContainer" class="visuallyhidden"></div>
  </div>
</template>

<script>
import WorkService from '../../../services/WorkService'
import WorkAdjuntService from '../../../services/WorkAdjuntService'
import workMixin from './WorkMixin'
import _ from 'lodash'
import log from 'loglevel'

export default {
	name: 'workNew',
	mixins: [workMixin],
	methods: {
		cleanComponent: function() {
			this.work.IdDentista = 0
			this.NombreDentista = ''
			this.work.IdTipoTrabajo = ''
			this.work.Paciente = ''
			this.work.Color = ''
			this.PrecioFinal = 0
			this.setStartDateToToday()
			this.work.FechaPrevista = ''
			this.workIndications = {}
			this.$refs.workIndications.cleanComponent()
			this.workAdjuncts = {}
			this.adjunctsVisible = false
			this.workAdjunctsJustAdded = false
			this.url = ''
			this.$v.$reset()
			this.$forceUpdate()
		},
		save: async function(url) {
			this.url = url

			this.saveButtonPressed = true
			this.$v.$touch()

			// If the row is not dirty, nothing will happen. If not, at least the info will be persisted, or the errors in validation will show up.
			this.$refs.workIndications.addLastRow()
			if (this.$v.$anyError || this.$refs.workIndications.isError()) {
				if (this.$refs.workIndications.isError()) {
					this.$refs.workIndications.focus()
				}
				if (this.$v.work.PrecioMetal.$anyError) {
					this.$refs.precioMetal.focus()
				}
				if (this.$v.work.IdTipoTrabajo.$anyError) {
					this.$refs.tipoTrabajo.focus()
				}
				if (this.$v.work.IdDentista.$anyError) {
					this.$refs.clinica.focus()
				}
				return false
			}

			if (this.$refs.workIndications.isDirty) {
				this.$refs.workIndications.save(this.work.IdTrabajo)
			}
			var sum = parseFloat(
				_.sumBy(this.workIndications, function(n) {
					var temp = parseFloat(n.Precio)
					if (isNaN(temp)) {
						throw 'NaN'
					} else {
						return temp
					}
				})
			)
			if (sum !== this.work.PrecioFinal) {
				this.work.PrecioFinal = sum
			}

			if (this.$v.work.$anyDirty) {
				this.work.IdTrabajo = await this.workService.insertWork(this.work)
				this.$refs.workIndications.save(this.work.IdTrabajo)
				if (this.adjunctsVisible) {
					this.workAdjuncts.IdTrabajo = this.work.IdTrabajo
					await this.workAdjuntService.insertAdjuntsOfWork(this.workAdjuncts)
				}
				this.showModal()
			}
		},
		showModal() {
			this.workIndicationsText = _.map(this.workIndications, 'Descripcion').join('\n')
			this.work.NombreDentista = this.$refs.clinica.query
			this.$refs.printLabelModal.show()
		},
		printLabels: function() {
			if (this.$refs.cbResina.checked) this.printLabel('Resina')
			if (this.$refs.cbCompostura.checked) this.printLabel('Compostura')
			if (this.adjunctsVisible && this.$refs.cbAditamentos.checked) this.printLabel('Aditamentos')
			if (this.$refs.cbEsqueletico.checked) this.printLabel('Esqueléticos')
			if (this.$refs.cbOrtodoncia.checked) this.printLabel('Ortodoncia')
			if (this.$refs.cbZirconio.checked) this.printLabel('Zirconio')
			if (this.$refs.cbImplantes.checked) this.printLabel('Implantes')
			if (this.$refs.cbEmax.checked) this.printLabel('E-Max')
			if (this.$refs.cbComposite.checked) this.printLabel('Composite')
			if (this.$refs.cbMetalCeramica.checked) this.printLabel('Metal-Cerámica')

			this.goBack()
		},
		goBack() {
			this.$v.$reset()
			if (!this.url) {
				this.$router.push({ path: `/works/details/${this.work.IdTrabajo}` })
			} else {
				this.$router.push({ path: this.url })
				log.info(`Work ${this.work.IdTrabajo} created`)
				this.$toasted.show(`Se ha creado el trabajo ${this.work.IdTrabajo}.`, {
					position: 'top-right',
					duration: null,
					singleton: true,
					iconPack: 'fontawesome',
					icon: {
						name: 'teeth'
					},
					action: [
						{
							text: 'Ver',
							onClick: (e, toastObject) => {
								this.$router.push({
									path: `/works/details/${this.work.IdTrabajo}`
								})
								toastObject.goAway(0)
							}
						},
						{
							text: 'Cerrar',
							onClick: (e, toastObject) => {
								toastObject.goAway(0)
							}
						}
					]
				})
			}
		},
		setBtnPrintEnabled() {
			this.$refs.btnPrint.disabled = !(
				this.$refs.cbResina.checked ||
				this.$refs.cbCompostura.checked ||
				(this.adjunctsVisible && this.$refs.cbAditamentos.checked) ||
				this.$refs.cbEsqueletico.checked ||
				this.$refs.cbOrtodoncia.checked ||
				this.$refs.cbZirconio.checked ||
				this.$refs.cbImplantes.checked ||
				this.$refs.cbEmax.checked ||
				this.$refs.cbComposite.checked ||
				this.$refs.cbMetalCeramica.checked
			)
		}
	},
	computed: {
		isDirty() {
			var result = this.$v.$anyDirty
			if (this.$refs.workIndications) {
				// If the row is not dirty, nothing will happen. If not, at least the info is persisted, or the errors in validation will show up.
				this.$refs.workIndications.addLastRow()
				result = result || this.$refs.workIndications.isDirty()
			}
			return result
		},
		isError() {
			var result = this.$v.$anyError
			if (this.$refs.workIndications) {
				// If the row is not dirty, nothing will happen. If not, at least the info is persisted, or the errors in validation will show up.
				this.$refs.workIndications.addLastRow()
				result = result || this.$refs.workIndications.isError()
			}
			return result
		}
	},
	created() {
    this.workService = new WorkService()
    this.workAdjuntService = new WorkAdjuntService()
	},
	mounted() {
		this.$root.$on('topbar:save', () => {
			log.debug('Requested to save from the topbar')
			this.save()
		})
		this.cleanComponent()
	}
}
</script>
