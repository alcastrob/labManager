<template>
	<div>
		<div class="container">
			<div class="row">
				<div class="col-md-4">
					<h1>Trabajo nº {{ work.IdTrabajo }}</h1>
				</div>
				<div class="col-md-8 mt-2">
					<div class="float-right">
						<div>
							<collapsible-action-button
								iconCss="fas fa-map-pin"
								text="Aditamentos"
								:callback="showAdjunts"
								v-if="!adjunctsVisible && !readOnly"
							></collapsible-action-button>
							<collapsible-action-button
								iconCss="fas fa-passport"
								text="Historial de seguimiento"
								:callback="showPostSales"
								:title="
									postSales.length === 0
										? 'La historia de seguimiento requiere que se haya guardado alguna entrada en el historial de seguimiento'
										: ''
								"
								:disabled="postSales.length === 0"
							></collapsible-action-button>
							<collapsible-action-button
								iconCss="fas fa-certificate"
								text="Declaración de Conformidad"
								:callback="showConformity"
								:title="
									!$v.work.FechaTerminacion.$model
										? 'La declaración de conformidad requiere que se establezca una fecha de terminación del trabajo'
										: ''
								"
								:disabled="!$v.work.FechaTerminacion.$model || $v.work.FechaTerminacion.$anyError"
							></collapsible-action-button>
							<collapsible-action-button
								iconCss="fas fa-dolly"
								text="Nota de entrega"
								:callback="getDeliveryNote"
								:title="
									!$v.work.FechaTerminacion.$model
										? 'La nota de entrega requiere que se establezca una fecha de terminación del trabajo'
										: ''
								"
								:disabled="!$v.work.FechaTerminacion.$model || $v.work.FechaTerminacion.$anyError"
							></collapsible-action-button>
							<button class="btn btn-warning dropdown-toggle" type="button" data-toggle="dropdown">
								<i class="fas fa-tags pr-1"></i>
								<span>Imprimir etiqueta</span>
							</button>
							<div class="dropdown-menu">
								<a
									href="#"
									class="dropdown-item"
									:class="{
										labeStrikethrough:
											$v.work.FechaTerminacion.$model === '' ||
											$v.work.FechaTerminacion.$model === null ||
											$v.work.FechaTerminacion.$anyError
									}"
									v-on:click="showWarrantyLabelModal"
									title="La nota de entrega requiere que se establezca una fecha de terminación del trabajo"
									>Garantía</a
								>
								<a href="#" class="dropdown-item" v-on:click="showLabelModal('Resina')">Resina</a>
								<a href="#" class="dropdown-item" v-on:click="showLabelModal('Compostura')">Compostura</a>
								<a
									href="#"
									class="dropdown-item"
									v-on:click="showLabelModal('Aditamentos')"
									v-if="workAdjuncts !== undefined"
									>Aditamentos</a
								>
								<a href="#" class="dropdown-item" v-on:click="showLabelModal('Esqueléticos')">Esqueléticos</a>
								<a href="#" class="dropdown-item" v-on:click="showLabelModal('Ortodoncia')">Ortodoncia</a>
								<a href="#" class="dropdown-item" v-on:click="showLabelModal('Zirconio')">Zirconio</a>
								<a href="#" class="dropdown-item" v-on:click="showLabelModal('Implantes')">Implantes</a>
								<a href="#" class="dropdown-item" v-on:click="showLabelModal('E-Max')">E-Max</a>
								<a href="#" class="dropdown-item" v-on:click="showLabelModal('Composite')">Composite</a>
								<a href="#" class="dropdown-item" v-on:click="showLabelModal('Metal-Cerámica')">Metal-Cerámica</a>
							</div>
							<!-- dropdown-menu -->
						</div>
					</div>
				</div>
			</div>
			<!-- row -->
			<div class="row" v-if="invoice">
				<div class="col-md-12">
					<span>
						Este trabajo está incluido en la factura
						<router-link :to="'/finances/invoices/' + invoice.IdFactura">{{ invoice.NumFactura }}</router-link
						>.
					</span>
				</div>
			</div>
			<div class="row" v-if="readOnly">
				<div class="col-md-12">
					<em>
						<span>Este trabajo está cerrado, por lo que no se puede editar.</span>
						<br />
						<span>
							Si, excepcionalmente, desea editarlo pulse
							<a href="#" @click="readOnly = false">aquí</a>.
						</span>
					</em>
				</div>
			</div>
			<div class="row">
				<div class="col-md-8">
					<div class="row">
						<div class="col-md-6 mb-3 mt-3">
							<label for="clinica">Clínica o Dr/a</label>
							<dentist-search
								id="clinica"
								ref="clinica"
								v-model="$v.work.IdDentista.$model"
								:isInvalid="$v.work.IdDentista.$error && saveButtonPressed"
								:disabled="readOnly"
								@change="updateDentist()"
							></dentist-search>
							<small class="text-danger" v-if="$v.work.IdDentista.$error && saveButtonPressed"
								>Es necesario especificar una clínica o dr/a.</small
							>
						</div>
						<!-- col-md-6 -->
						<div class="col-md-6 mt-3">
							<label for="paciente">Paciente</label>
							<input
								type="text"
								class="form-control"
								v-model="$v.work.Paciente.$model"
								:disabled="readOnly"
								ref="paciente"
							/>
						</div>
						<!-- col-md-6 -->
						<div class="col-md-3">
							<label for="tipoTrabajo">Tipo trabajo</label>
							<select
								class="form-control"
								id="tipoTrabajo"
								ref="tipoTrabajo"
								v-model="$v.work.IdTipoTrabajo.$model"
								:disabled="readOnly"
								:class="{ 'is-invalid': $v.work.IdTipoTrabajo.$error }"
							>
								<option disabled value>Seleccione una opción</option>
								<option v-for="type in workTypes" v-bind:key="type.IdTipoTrabajo" v-bind:value="type.IdTipoTrabajo">
									{{ type.Descripcion }}
								</option>
							</select>
							<small class="text-danger" v-if="$v.work.IdTipoTrabajo.$error && saveButtonPressed"
								>Es necesario especificar un tipo de trabajo.</small
							>
						</div>
						<!-- col-md-6 -->
						<div class="col-md-3">
							<label for="precioMetal">Precio metal</label>
							<input
								type="text"
								class="form-control"
								id="precioMetal"
								ref="precioMetal"
								@input="metalPriceChanged"
								placeholder="€"
								v-model="$v.work.PrecioMetal.$model"
								:class="{ 'is-invalid': $v.work.PrecioMetal.$error }"
								:disabled="readOnly"
							/>
							<small class="text-danger" v-if="$v.work.PrecioMetal.$error"
								>Aunque opcional, se requiere que el precio del metal sea válido</small
							>
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
								:disabled="readOnly"
							/>
						</div>
						<!-- col-md-4 -->
					</div>
					<!-- row -->
				</div>
				<!-- col-md-8 -->
				<div class="col-md-4 separated-column text-left">
					<h4>Ficheros</h4>
					<imagesFileUpload :multipleFiles="true" accept="image/*" :idTrabajo="work.IdTrabajo"></imagesFileUpload>
				</div>
				<!-- col-md-4 -->
			</div>
			<!-- row -->
			<div class="row">
				<div class="col-md-12 mt-4">
					<h4>Indicaciones</h4>
					<workIndicationsTable
						v-model="workIndications"
						ref="workIndications"
						@change="indicationsTotalChanged"
						:disabled="readOnly"
					></workIndicationsTable>
				</div>
				<!-- col-md-12 -->
			</div>
			<!-- row -->
			<div class="row mb-4" v-if="isAdmin">
				<div class="col-md-12 mt-2">
					<h4>Descuentos</h4>
				</div>
				<!-- col-md-12 -->
				<div class="col-md-4">
					<label>Porcentaje descuento</label>
					<percentageInput
						class="form-control text-right inputInForm"
						v-model="$v.work.PorcentajeDescuento.$model"
						@input="updatePercentageDiscount"
						:disabled="readOnly"
					></percentageInput>
				</div>
				<!-- col-md-3 -->
				<div class="col-md-4">
					<label>Importe descuento</label>
					<euroInput
						class="form-control text-right inputInForm"
						v-model="$v.work.TotalDescuento.$model"
						@input="updateTotalDiscount"
						:disabled="readOnly"
					></euroInput>
				</div>
				<!-- col-md-3 -->
				<div class="col-md-4">
					<label>Total trabajo</label>
					<input type="text" class="form-control text-right" ref="grandTotal" disabled />
				</div>
				<!-- col-md-3 -->
			</div>
			<!-- row -->
			<div class="row">
				<div class="col-md-12 mt-2">
					<h4>Fechas</h4>
				</div>
				<!-- col-md-12 -->
				<div class="col-md-3">
					<label for="fEntrada">Fecha entrada</label>
					<input
						type="date"
						class="form-control"
						id="fEntrada"
						placeholder="dd/mm/aaaa"
						v-model="$v.work.FechaEntrada.$model"
						@blur="triggerIsDirty($event)"
						@input="triggerIsDirty($event)"
						:disabled="readOnly"
					/>
					<a
						href="#"
						class="form-text text-muted ml-2"
						@click="$v.work.FechaEntrada.$model = getToday()"
						v-if="!readOnly"
					>
						<i class="far fa-calendar-alt"></i>
						Poner fecha de hoy
					</a>
				</div>
				<!-- col-md-3 -->
				<div class="col-md-3">
					<label for="fPrevistaPrueba">Fecha prevista prueba</label>
					<input
						type="date"
						class="form-control"
						id="fPrevistaPrueba"
						placeholder="dd/mm/aaaa"
						v-model="$v.work.FechaPrevistaPrueba.$model"
						@blur="triggerIsDirty($event)"
						@input="triggerIsDirty($event)"
						:disabled="readOnly"
					/>
				</div>
				<!-- col-md-3 -->
				<div class="col-md-3">
					<label for="fPrevista">Fecha prevista terminación</label>
					<input
						type="date"
						class="form-control"
						id="fPrevista"
						placeholder="dd/mm/aaaa"
						v-model="$v.work.FechaPrevista.$model"
						@blur="triggerIsDirty($event)"
						@input="triggerIsDirty($event)"
						:disabled="readOnly"
					/>
				</div>
				<!-- col-md-3 -->
				<div class="col-md-3">
					<label for="fSalida">Fecha terminación</label>
					<input
						type="date"
						class="form-control"
						id="fSalida"
						placeholder="dd/mm/aaaa"
						v-model="$v.work.FechaTerminacion.$model"
						@blur="triggerIsDirty($event)"
						@input="triggerIsDirty($event)"
						:disabled="readOnly"
					/>
					<a
						href="#"
						class="form-text text-muted ml-2"
						@click="$v.work.FechaTerminacion.$model = getToday()"
						v-if="!readOnly"
					>
						<i class="far fa-calendar-alt"></i>
						Poner fecha de hoy
					</a>
				</div>
				<!-- col-md-3 -->
			</div>
			<!-- row -->

			<div class="row">
				<div class="col-md-12 mt-4">
					<h4>Pruebas</h4>
					<workTestsTable
						v-model="workTests"
						:workId="work.IdTrabajo"
						ref="workTests"
						:disabled="readOnly"
					></workTestsTable>
				</div>
				<!-- col-md-12 -->
			</div>
			<!-- row -->

			<div class="row">
				<div class="col-md-12 mt-4">
					<h4>Historial de seguimiento</h4>
					<postSalesTable
						v-model="postSales"
						:workId="work.IdTrabajo"
						ref="postSales"
						:disabled="readOnly"
					></postSalesTable>
				</div>
			</div>

			<div class="row">
				<div class="col-md-12 mt-4">
					<workAdjuncts v-model="$v.workAdjuncts.$model" v-if="adjunctsVisible" :disabled="readOnly"></workAdjuncts>
				</div>
				<!-- col-md-8 -->
			</div>

			<!-- row -->
			<div class="row">
				<div class="col-md-12 mt-3">
					<button
						class="btn btn-secondary btn-block"
						type="button"
						@click="save($parent.$refs.topBar.from.fullPath)"
						v-if="!readOnly"
						ref="btnSave"
					>
						<i class="fas fa-save"></i>
						Guardar
					</button>
					<span ref="dirties"></span>
				</div>
			</div>
		</div>
		<!-- container -->
		<b-modal ref="printLabelModal" title="Imprimir etiqueta" hide-footer>
			<div class="modal-body">
				<label for="labelText"
					>Se va a imprimir una etiqueta de tipo {{ printedLabel }}. Por favor, indique el texto que aparecerá en ella a
					continuación y pulse Imprimir.</label
				>
				<textarea class="form-control" id="labelText" rows="4" cols="60" v-model="workIndicationsText"></textarea>
			</div>
			<div class="modal-footer">
				<button class="btn btn-secondary" @click="hideModal">
					<i class="fas fa-times-circle mr-2 position-relative" style="top: 1px"></i>Cancelar
				</button>
				<button class="btn btn-secondary" @click="printLabelAndHide">
					<i class="fas fa-print mr-2 position-relative" style="top: 1px"></i>Imprimir
				</button>
			</div>
		</b-modal>
		<b-modal ref="includedInInvoiceModal" title="Trabajo incluido en una factura emitida" hide-footer v-if="invoice">
			<div class="modal-body">
				<label for="labelText"
					>Este trabajo forma parte de la factura {{ invoice.NumFactura }}. Los cambios que se realicen en él alterarán
					el contenido de dicha factura. ¿Desea continuar?</label
				>
			</div>
			<div class="modal-footer">
				<button class="btn btn-secondary" @click="$refs.includedInInvoiceModal.hide()">Cancelar</button>
				<button class="btn btn-secondary" @click="save(undefined, true)">Continuar</button>
			</div>
		</b-modal>
		<warrantyLabel :workData="work" ref="warrantyLabel" period="TRES" class="visuallyhidden"></warrantyLabel>
		<conformityModal ref="conformity" :work="work"></conformityModal>
		<div ref="labelContainer" class="visuallyhidden"></div>
	</div>
</template>

<script>
import Vue from 'vue'
import _ from 'lodash'
import InvoiceService from '../../../services/InvoiceService'
import WorkService from '../../../services/WorkService'
import WorkIndicationService from '../../../services/WorkIndicationService'
import WorkTestService from '../../../services/WorkTestService'
import PostSalesService from '../../../services/PostSalesService'
import WorkAdjuntService from '../../../services/WorkAdjuntService'
import ConfigFileService from '../../../services/ConfigFileService'
import workMixin from './WorkMixin'
import euroInput from '../PageElements/tables/euroInput'
import percentageInput from '../PageElements/tables/percentageInput'
import delivery from '../Labels/Delivery'
import postSales from '../Labels/PostSales'
import imagesFileUpload from '../PageElements/fileUploads/imagesFileUplodad'
import conformityModal from '../PageElements/ConformityModal'
import warrantyLabel from '../Labels/LabelGarantia'
import log from 'loglevel'
const VueScrollTo = require('vue-scrollto')

Vue.use(VueScrollTo)

export default {
	name: 'workDetail',
	mixins: [workMixin],
	components: {
		conformityModal,
		warrantyLabel,
		imagesFileUpload,
		euroInput,
		percentageInput
	},
	data() {
		return {
			printedLabel: '',
			workTests: [],
			postSales: [],
			readOnly: false,
			invoice: undefined,
			isAdmin: false,
			moneyFormatter: new Intl.NumberFormat('es-ES', {
				style: 'currency',
				currency: 'EUR'
			})
		}
	},
	methods: {
		cleanComponent: function () {
			this.work.IdDentista = 0
			this.NombreDentista = ''
			this.work.IdTipoTrabajo = ''
			this.work.Paciente = ''
			this.work.Color = ''
			this.PrecioConDescuento = 0
			this.PrecioSinDescuento = 0
			this.work.FechaEntrada = ''
			this.work.FechaPrevista = ''
			this.work.PorcentajeDescuento = 0
			this.work.TotalDescuento = 0
			this.workIndications = {}
			this.$refs.workIndications.cleanComponent()
			this.workTests = {}
			this.$refs.workTests.cleanComponent()
			this.workAdjuncts = {}
			this.adjunctsVisible = false
			this.workAdjunctsJustAdded = false
			this.postSales = {}
			this.$refs.postSales.cleanComponent()
			this.url = ''
			this.$v.$reset()
			this.$forceUpdate()
		},
		save: async function (url, changeInvoiceConfirmed = false) {
			this.saveButtonPressed = true
			this.$v.$touch()

			// If the rows are not dirty, nothing will happen. If not, at least the info will be persisted, or the errors in validation will show up.
			if (this.$refs.workIndications) {
				this.$refs.workIndications.addLastRow()
			}
			if (this.$refs.workTests) {
				this.$refs.workTests.addLastRow()
			}
			if (this.$refs.postSales) {
				this.$refs.postSales.addLastRow()
			}
			if (
				this.$v.$anyError ||
				this.$refs.workIndications.isError() ||
				this.$refs.workTests.isError() ||
				this.$refs.postSales.isError()
			) {
				if (this.$refs.workTests.isError()) {
					this.$refs.workTests.focus()
					this.$scrollTo(this.$refs.btnSave, 1000)
				}
				if (this.$refs.postSales.isError()) {
					this.$refs.postSales.focus()
					this.$scrollTo(this.$refs.btnSave, 1000)
				}
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
			if (this.invoice && !changeInvoiceConfirmed) {
				this.$refs.includedInInvoiceModal.show()
				return
			}

			if (this.invoice) {
				if (!changeInvoiceConfirmed) {
					this.$refs.includedInInvoiceModal.show()
					return
				}
				// If the work is included in a invoice, the confirmation dialog will still be on screen. We must dismiss it.
				this.$refs.includedInInvoiceModal.hide()
			}

			if (this.$refs.workIndications.isDirty) {
				this.$refs.workIndications.save(this.work.IdTrabajo)
			}
			var sum = parseFloat(
				_.sumBy(this.workIndications, function (n) {
					var temp = parseFloat(n.Precio)
					if (isNaN(temp)) {
						throw 'NaN'
					} else {
						return temp
					}
				})
			)
			// if (!this.isAdmin) {
			// 	// The user is modifying the ammount of the work, but has no visibility on the discounts. So, we reset them in
			// 	// order to warn the admin up during the month check operation
			// 	this.work.TotalDescuento = 0
			// 	this.work.PorcentajeDescuento = 0
			// }

			this.work.PrecioSinDescuento = sum
			this.work.PrecioConDescuento = this.work.PrecioSinDescuento - this.work.TotalDescuento

			if (this.work.FechaTerminacion) {
				this.work.FechaPrevista = null
			}
			if (this.$v.work.$anyDirty) {
				await this.workService.updateWork(this.work)
				if (this.invoice) {
					// We also update the grand total of the invoice this work is included.
					await this.invoiceService.updateInvoiceGrandTotal(this.invoice.IdFactura)
				}
			}
			if (this.$refs.workTests.isDirty) {
				this.$refs.workTests.save(this.work.IdTrabajo)
			}
			if (this.$refs.postSales.isDirty) {
				this.$refs.postSales.save(this.work.IdTrabajo)
			}
			if (this.workAdjuncts && this.$v.workAdjuncts.$anyDirty) {
				this.workAdjuncts.IdTrabajo = this.work.IdTrabajo
				if (this.workAdjunctsJustAdded) {
					this.workAdjuntService.insertAdjuntsOfWork(this.workAdjuncts)
				} else {
					this.workAdjuntService.updateAdjuntsOfWork(this.workAdjuncts)
				}
			}

			// Everything went right. Depending how do you reach this function, you'll have tow ways of leaving it
			if (url) {
				// Direct click on the SAVE button. Just get redirected to the URL
				this.$router.push({
					path: url
				})
			} else {
				// You clicked on a print label button thar requires a previous save (and to get informed if the save was successfully or not). Get a true as return
				this.$v.$reset()
				return true
			}
		},
		showWarrantyLabelModal() {
			if (this.work.FechaTerminacion !== '' && !this.$v.work.FechaTerminacion.$anyError) {
				if (this.save()) {
					this.$refs.warrantyLabel.waitLogoAndPrint()
				}
			}
		},
		showLabelModal(labelType) {
			if (this.save()) {
				this.printedLabel = labelType
				if (this.workIndications !== undefined) {
					this.workIndicationsText = _.map(this.workIndications, 'Descripcion').join('\n')
				} else {
					this.workIndicationsText = ''
				}
				this.$refs.printLabelModal.show()
			}
		},
		printLabelAndHide: function () {
			this.printLabel()
			this.hideModal()
		},
		getDeliveryNote: async function () {
			log.info('Clicked on the Delivery Note button')
			if (this.save()) {
				var row = await this.workService.getConfigValues(['logo'])
				var ComponentClass = Vue.extend(delivery)
				var instance = new ComponentClass({
					propsData: {
						IdTrabajo: this.work.IdTrabajo,
						NombreDentista: this.work.NombreDentista,
						Paciente: this.work.Paciente,
						FechaTerminacion: new Date(this.work.FechaTerminacion),
						Detalles: this.workIndications,
						PrecioSinDescuento: this.work.PrecioSinDescuento,
						logo: 'data:image/png;base64,' + row[0].valor
					}
				})
				instance.$mount()
				instance.print(this.$refs.labelContainer)
				log.info(`Printed the delivery note for work ${this.work.IdTrabajo}`)
			}
		},
		showConformity() {
			log.info('Clicked on the Conformity Declaration button')
			if (this.save()) {
				this.$refs.conformity.show()
			}
		},
		showPostSales: async function () {
			log.info('Clicked on the Postsales button')
			if (this.save()) {
				var logo = await this.workService.getConfigValues(['logo'])
				var maker = await this.workService.getConfigValues(['makerNumber'])
				var workType = (await this.workService.getWorkType(this.work.IdTipoTrabajo))[0].Descripcion
				var colNumbers = (await this.workService.getConfigValues(['personInCharge']))[0].valor
				var ComponentClass = Vue.extend(postSales)
				var instance = new ComponentClass({
					propsData: {
						IdTrabajo: this.work.IdTrabajo,
						PostSales: this.postSales,
						Paciente: this.work.Paciente,
						ColNumber: colNumbers,
						ProductType: workType,
						logo: 'data:image/png;base64,' + logo[0].valor,
						Maker: maker[0].valor
					}
				})
				instance.$mount()
				instance.print(this.$refs.labelContainer)
				log.info(`Printed the postsales label for work ${this.work.IdTrabajo}`)
			}
		},
		triggerIsDirty(event) {
			if (!event.currentTarget.validity.valid) {
				switch (event.currentTarget.id) {
					case 'fEntrada':
						this.work.FechaEntrada = ''
						break
					case 'fPrevista':
						this.work.FechaPrevista = ''
						break
					case 'fPrevistaPrueba':
						this.work.FechaPrevistaPrueba = ''
						break
					case 'fSalida':
						this.work.FechaTerminacion = ''
						break
				}
			}
		},
		metalPriceChanged(event) {
			// This function receives an event, because the control used is directly an input field, and not a
			// percentegeInput or an euroInput.
			var newValue = parseFloat(event.data).toFixed(2)

			// Short-circuit any colateral ecent triggered from updatePercentageDiscount or updateTotalDiscount
			if (this.work.PrecioMetal !== newValue) {
				if (this.work.PrecioSinDescuento !== 0) {
					var sumaTotalMetal = this.work.PrecioMetal
						? this.work.PrecioSinDescuento - this.work.PrecioMetal
						: this.work.PrecioSinDescuento
					this.work.TotalDescuento = ((sumaTotalMetal * this.work.PorcentajeDescuento) / 100).toFixed(2)
					this.work.PrecioConDescuento = (this.work.PrecioSinDescuento - this.work.TotalDescuento).toFixed(2)
				}
				this.calculateGrandTotal()
			}
		},
		indicationsTotalChanged(newTotal) {
			// Short-circuit any colateral ecent triggered from updatePercentageDiscount or updateTotalDiscount
			if (this.work.PrecioSinDescuento !== newTotal) {
				this.work.PrecioSinDescuento = newTotal
				if (this.work.PrecioSinDescuento !== 0) {
					var sumaTotalMetal = this.work.PrecioMetal
						? this.work.PrecioSinDescuento - this.work.PrecioMetal
						: this.work.PrecioSinDescuento
					this.work.TotalDescuento = ((sumaTotalMetal * this.work.PorcentajeDescuento) / 100).toFixed(2)
					this.work.PrecioConDescuento = (this.work.PrecioSinDescuento - this.work.TotalDescuento).toFixed(2)
				}
				this.calculateGrandTotal()
			}
		},
		updatePercentageDiscount(percentageDiscount) {
			this.work.PorcentajeDescuento = percentageDiscount
			var sumaTotalMetal = this.work.PrecioMetal
				? this.work.PrecioSinDescuento - this.work.PrecioMetal
				: this.work.PrecioSinDescuento
			this.work.TotalDescuento = parseFloat((sumaTotalMetal * this.work.PorcentajeDescuento) / 100).toFixed(2)
			this.work.PrecioConDescuento = (this.work.PrecioSinDescuento - this.work.TotalDescuento).toFixed(2)
			this.calculateGrandTotal()
		},
		updateTotalDiscount(totalDiscount) {
			this.work.TotalDescuento = totalDiscount
			var sumaTotalMetal = this.work.PrecioMetal
				? this.work.PrecioSinDescuento - this.work.PrecioMetal
				: this.work.PrecioSinDescuento
			this.work.PorcentajeDescuento = parseFloat((this.work.TotalDescuento * 100) / sumaTotalMetal).toFixed(2)
			this.work.PrecioConDescuento = (this.work.PrecioSinDescuento - this.work.TotalDescuento).toFixed(2)
			this.calculateGrandTotal()
		},
		calculateGrandTotal() {
			if (this.isAdmin) {
				this.$refs.grandTotal.value = this.moneyFormatter.format(this.work.PrecioConDescuento)
			}
		},
		updateDentist() {
			this.work.NombreDentista = this.$refs.clinica.query
			this.$refs.paciente.focus()
		},
		doValidatorExtraChecks() {
			this.$refs.dirties.innerHTML = ''
			this.$refs.dirties.innerHTML += `IdDentista: ${this.$v.work.IdDentista.$anyError} | ${this.$v.work.IdDentista.$anyDirty} <br> `
			this.$refs.dirties.innerHTML += `Paciente: ${this.$v.work.Paciente.$anyError} | ${this.$v.work.Paciente.$anyDirty} <br> `
			this.$refs.dirties.innerHTML += `TipoTrabajo: ${this.$v.work.IdTipoTrabajo.$anyError} | ${this.$v.work.IdTipoTrabajo.$anyDirty} <br> `
			this.$refs.dirties.innerHTML += `PrecioMetal: ${this.$v.work.PrecioMetal.$anyError} | ${this.$v.work.PrecioMetal.$anyDirty} <br> `
			this.$refs.dirties.innerHTML += `Color: ${this.$v.work.Color.$anyError} | ${this.$v.work.Color.$anyDirty} <br> `
			this.$refs.dirties.innerHTML += `Indicaciones: ${this.$refs.workIndications.isError()} | ${this.$refs.workIndications.isDirty()} <br> `
			this.$refs.dirties.innerHTML += `FechaEntrada: ${this.$v.work.FechaEntrada.$anyError} | ${this.$v.work.FechaEntrada.$anyDirty} <br> `
			this.$refs.dirties.innerHTML += `FechaPrevista: ${this.$v.work.FechaPrevista.$anyError} | ${this.$v.work.FechaPrevista.$anyDirty} <br> `
			this.$refs.dirties.innerHTML += `FechaTerminacion: ${this.$v.work.FechaTerminacion.$anyError} | ${this.$v.work.FechaTerminacion.$anyDirty} <br> `
			this.$refs.dirties.innerHTML += `Pruebas: ${this.$refs.workTests.isError()} | ${this.$refs.workTests.isDirty()} <br> `
		},
		getData: async function () {
			this.work = await this.workService.getWork(this.work.IdTrabajo)
			log.debug(`work: ${JSON.stringify(this.work)}`)
			this.readOnly = this.work.FechaTerminacion !== null || this.workService.readonly
			this.workIndications = await this.workIndicationService.getWorkIndications(this.work.IdTrabajo)
			this.workAdjuncts = await this.workAdjuntService.getAdjuntsOfWork(this.work.IdTrabajo)
			if (this.workAdjuncts) {
				this.showAdjunts(false)
			}
			this.workTests = await this.workTestService.getWorkTestsList(this.work.IdTrabajo)
			this.postSales = await this.postSalesService.getPostSaleList(this.work.IdTrabajo)
			if (this.isAdmin) {
				this.invoice = await this.invoiceService.getInvoicePerWork(this.work.IdTrabajo)
				this.$refs.grandTotal.value = this.moneyFormatter.format(
					this.work.PrecioSinDescuento - this.work.TotalDescuento
				)
			}
		}
	},
	computed: {
		isDirty() {
			if (this.readOnly) {
				return false
			}
			var result = this.$v.$anyDirty
			if (this.$refs.workIndications) {
				// If the row is not dirty, nothing will happen. If not, at least the info is persisted, or the errors in validation will show up.
				this.$refs.workIndications.addLastRow()
				result = result || this.$refs.workIndications.isDirty()
			}
			if (this.$refs.workTests) {
				// If the row is not dirty, nothing will happen. If not, at least the info is persisted, or the errors in validation will show up.
				this.$refs.workTests.addLastRow()
				result = result || this.$refs.workTests.isDirty()
			}
			return result
		},
		isError() {
			var result = this.$v.$anyError
			if (this.$refs.workIndications) {
				// If the row is not dirty, nothing will happen. If not, at least the info is persisted, or the errors in validation will show up.
				this.$refs.workIndications.addLastRow()
				result = result || this.$refs.workIndications.isError()
				return result
			}
			if (this.$refs.workTests) {
				// If the row is not dirty, nothing will happen. If not, at least the info is persisted, or the errors in validation will show up.
				this.$refs.workTests.addLastRow()
				result = result || this.$refs.workTests.isError()
			}
			return result
		}
	},
	created() {
		this.workService = new WorkService()
		this.invoiceService = new InvoiceService()
		this.workIndicationService = new WorkIndicationService()
		this.workTestService = new WorkTestService()
		this.postSalesService = new PostSalesService()
		this.workAdjuntService = new WorkAdjuntService()
		this.configFileService = new ConfigFileService()
		this.work.IdTrabajo = parseInt(this.$route.params.id)
	},
	mounted() {
		this.getData()
		this.$root.$on('topbar:save', this.save)
		this.isAdmin = this.configFileService.configGet('isAdmin')
	}
}
</script>
<style>
.labeStrikethrough,
.labeStrikethrough:hover {
	text-decoration: line-through;
}
.inputInForm {
	height: 38px !important;
}
</style>
