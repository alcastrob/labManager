<template>
  <div class="container printed pagebreak" :class="{'pageBorder': !forPrinter}">
    <div class="row">
      <div class="col-sm-6">
        <img @load="logoLoaded" :src="logo" class="mt-3">
        <br>
        CIF: {{vatNumber}}
      </div>
      <!-- col-sm-6 -->
      <div class="col-sm-6">
        <h1 class="text-uppercase text-right mt-3">Factura</h1>
      </div>
      <!-- col-sm-6 -->
    </div>
    <!-- row -->
    <div class="row mt-2">
      <div class="col-sm-6">
        <h5>Número: {{invoice.NumFactura}} | Fecha: {{format(invoice.Fecha)}}</h5>
      </div>
      <!-- col-sm-6 -->
      <div class="col-sm-6">
        <div class="clientBox">
          <h3 class="text-uppercase">Cliente</h3>
          {{invoice.NombreDentista}}
          <br>
          {{invoice.NombreClinica}}
          <br>
          {{invoice.DatosFiscales}}
          <br>
          {{invoice.Direccion}}
          <br>
          {{invoice.CP}} {{invoice.Poblacion}}
        </div>
      </div>
      <!-- col-sm-6 -->
    </div>
    <!-- row -->
    <div class="row mt-5">
      <div class="col-sm-12">
        <!-- forPrinter -->
        <div style="height: 1075px;" v-if="forPrinter">
          <div
            v-if="!isFirstPage"
            class="text-right font-italic"
          >...continúa desde la página anterior.</div>
          <table class="table table-invoice" width="100%" cellspacing="0">
            <thead>
              <tr>
                <th class="text-left" style="width: 50%;">Concepto</th>
                <th class="text-right" style="width: 10%;">Cantidad</th>
                <th class="text-right" style="width: 10%;">P. Unidad</th>
                <th class="text-right" style="width: 11%;">Importe</th>
                <th class="text-right" style="width: 10%;">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="work in works">
                <tr v-bind:key="work.IdTrabajo" class="pagebreak">
                  <td class="text-left">
                    <span
                      class="font-weight-bold"
                    >Nº Trabajo: {{work.IdTrabajo}}. Fecha: {{format(work.FechaEntrada)}}</span>
                    <br>
                    <span class>{{work.Paciente}}</span>
                  </td>
                  <td class="text-right"></td>
                  <!-- <td class="text-right">1</td> -->
                  <!-- <td class="text-right">{{moneyFormatter.format(work.PrecioSinDescuento)}}</td>
                  <td class="text-right">{{moneyFormatter.format(work.TotalDescuento)}}</td>
                  <td class="text-right">{{moneyFormatter.format(work.PrecioFinalConDescuento)}}</td>-->
                  <td class="text-right"></td>
                  <td class="text-right"></td>
                  <td class="text-right"></td>
                </tr>
                <tr
                  class="leapTr dontBreakHere"
                  v-for="indication in indications[work.IdTrabajo]"
                  v-bind:key="indication.IdTrabajoDetalle"
                >
                  <td class="text-left">
                    <span class="text-monospace">{{indication.Descripcion}}</span>
                    <span v-if="indication.Notas">({{indication.Notas}})</span>
                  </td>
                  <!-- <td class="text-right"></td>
                  <td class="text-right"></td>-->
                  <td class="text-right">{{indication.Cantidad}}</td>
                  <td class="text-right">{{moneyFormatter.format(indication.Precio)}}</td>
                  <!-- <td class="text-right"></td> -->
                  <td
                    class="text-right"
                  >{{moneyFormatter.format(indication.Precio * indication.Cantidad)}}</td>
                  <td class="text-right"></td>
                </tr>
                <tr class="leapTr">
                  <td class="text-left" v-if="editing"></td>
                  <td class="text-left">
                    <span class="text-monospace">Descuento</span>
                    <span v-if="!editing">({{work.PorcentajeDescuento}}%)</span>
                  </td>
                  <td></td>

                  <template v-if="editing">
                    <td class="text-right">
                      <euroInput
                        class="form-control text-right inputInForm"
                        v-model="work.TotalDescuento"
                        @input="updateTotalDiscount(work)"
                      ></euroInput>
                    </td>
                    <td class="text-right">
                      <percentageInput
                        class="form-control text-right inputInForm"
                        v-model="work.PorcentajeDescuento"
                        @input="updatePercentageDiscount(work)"
                      ></percentageInput>
                    </td>
                  </template>
                  <template v-else>
                    <td class="text-right">-{{moneyFormatter.format(work.TotalDescuento)}}</td>
                  </template>

                  <td class="text-right">-{{moneyFormatter.format(work.TotalDescuento)}}</td>
                  <td></td>
                  <!-- <td class="text-right">{{moneyFormatter.format(work.PrecioFinalConDescuento)}}</td> -->
                </tr>
                <tr class="leapTr">
                  <td class="text-left" v-if="editing"></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td class="text-right">{{moneyFormatter.format(work.PrecioFinalConDescuento)}}</td>
                </tr>
              </template>
            </tbody>
          </table>
          <div
            class="text-right font-weight-bold"
            v-if="isLastPage"
          >Total: {{moneyFormatter.format(invoice.Total)}}</div>
          <div class="mt-4" v-if="appliedDiscount > 0 && isLastPage">
            <h4>Detalle de los descuentos aplicados</h4>
            <div
              class="mb-4 font-weight-bold text-right"
            >Descuento aplicado: {{moneyFormatter.format(appliedDiscount)}} ({{appliedPercentageDiscount.toFixed(2)}}% sobre total)</div>
          </div>
          <div class="text-right font-italic" v-else>...suma y sigue.</div>
        </div>
        <!-- end forPrinter -->
        <!-- forScreen -->
        <div v-else>
          <table class="table table-invoice" width="100%" cellspacing="0">
            <thead>
              <tr>
                <template v-if="editing">
                  <th class="text-left" style="width: 2%;"></th>
                  <th class="text-left" style="width: 48%;">Concepto</th>
                </template>
                <template v-else>
                  <th class="text-left" style="width: 50%;">Concepto</th>
                </template>
                <th class="text-right" style="width: 10%;">Cantidad</th>
                <th class="text-right" style="width: 10%;">P. Unidad</th>
                <th class="text-right" style="width: 11%;">Importe</th>
                <th class="text-right" style="width: 10%;">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="work in works">
                <tr v-bind:key="work.IdTrabajo" class="pagebreak">
                  <td class="text-left" v-if="editing">
                    <i
                      class="fas fa-times-circle"
                      @click="deleteWork(work.IdTrabajo)"
                      v-if="works.length > 1"
                    ></i>
                  </td>
                  <td class="text-left">
                    <span
                      class="font-weight-bold"
                    >Nº Trabajo: {{work.IdTrabajo}}. Fecha: {{format(work.FechaEntrada)}}</span>
                    <br>
                    <span class>{{work.Paciente}}</span>
                  </td>
                  <td class="text-right"></td>
                  <!-- <td class="text-right">1</td> -->
                  <!-- <td class="text-right">{{moneyFormatter.format(work.PrecioSinDescuento)}}</td> -->
                  <td class="text-right"></td>
                  <td class="text-right">
                    <!-- <template v-if="editing">
                      <percentageInput
                        class="form-control text-right inputInForm"
                        v-model="work.PorcentajeDescuento"
                        @input="updatePercentageDiscount(work)"
                      ></percentageInput>
                      <euroInput
                        class="form-control text-right inputInForm"
                        v-model="work.TotalDescuento"
                        @input="updateTotalDiscount(work)"
                      ></euroInput>
                    </template>
                    <template v-else>{{moneyFormatter.format(work.TotalDescuento)}}</template>-->
                  </td>
                  <!-- <td class="text-right">{{moneyFormatter.format(work.PrecioFinalConDescuento)}}</td> -->
                  <td class="text-right"></td>
                </tr>
                <tr
                  class="leapTr dontBreakHere"
                  v-for="indication in indications[work.IdTrabajo]"
                  v-bind:key="indication.IdTrabajoDetalle"
                >
                  <td class="text-left" v-if="editing"></td>
                  <td class="text-left">
                    <span class="text-monospace">{{indication.Descripcion}}</span>
                    <span v-if="indication.Notas">({{indication.Notas}})</span>
                  </td>
                  <td class="text-right">{{indication.Cantidad}}</td>
                  <td class="text-right">{{moneyFormatter.format(indication.Precio)}}</td>

                  <td
                    class="text-right"
                  >{{moneyFormatter.format(indication.Precio * indication.Cantidad)}}</td>
                  <td class="text-right"></td>
                </tr>
                <tr class="leapTr">
                  <td class="text-left" v-if="editing"></td>
                  <td class="text-left">
                    <span class="text-monospace">Descuento</span>
                    <span v-if="!editing">({{work.PorcentajeDescuento}}%)</span>
                  </td>
                  <td></td>

                  <template v-if="editing">
                    <td class="text-right">
                      <euroInput
                        class="form-control text-right inputInForm"
                        v-model="work.TotalDescuento"
                        @input="updateTotalDiscount(work)"
                      ></euroInput>
                    </td>
                    <td class="text-right">
                      <percentageInput
                        class="form-control text-right inputInForm"
                        v-model="work.PorcentajeDescuento"
                        @input="updatePercentageDiscount(work)"
                      ></percentageInput>
                    </td>
                  </template>
                  <template v-else>
                    <td class="text-right">-{{moneyFormatter.format(work.TotalDescuento)}}</td>
                  </template>

                  <td class="text-right">-{{moneyFormatter.format(work.TotalDescuento)}}</td>
                  <td></td>
                  <!-- <td class="text-right">{{moneyFormatter.format(work.PrecioFinalConDescuento)}}</td> -->
                </tr>
                <tr class="leapTr">
                  <td class="text-left" v-if="editing"></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td class="text-right">{{moneyFormatter.format(work.PrecioFinalConDescuento)}}</td>
                </tr>
              </template>
            </tbody>
          </table>
          <div
            class="text-right font-weight-bold pb-5"
          >Total: {{moneyFormatter.format(invoice.Total)}}</div>
          <div v-if="!editing">
            <h4>Detalle de los descuentos aplicados</h4>
            <div
              class="mb-4 font-weight-bold text-right"
            >Descuento aplicado: {{moneyFormatter.format(appliedDiscount)}} ({{appliedPercentageDiscount.toFixed(2)}}% sobre total)</div>
          </div>
        </div>
        <!-- end forScreen -->
        <button
          class="btn btn-secondary btn-block mb-4"
          type="button"
          @click="save()"
          v-if="editing"
          ref="btnSave"
        >
          <i class="fas fa-save"></i>
          Guardar
        </button>
      </div>
      <!-- col-sm-12 -->
    </div>
    <!-- row -->

    <div class="text-right" v-if="forPrinter">Página {{pageNumber}}</div>
    <div class="fixed-bottom printed-1" v-if="forPrinter">
      <div class="text-justify printed">{{footer}}</div>
    </div>
    <b-modal ref="editInvoiceModal" title="Se va a cambiar la factura" hide-footer v-if="editing">
      <div class="modal-body">
        <label
          for="labelText"
        >Al pulsar el botón guardar, los cambios realizados en esta factura serán permanente y no se podrán deshacer. ¿Desea continuar?</label>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" @click="$refs.editInvoiceModal.hide()">Cancelar</button>
        <button class="btn btn-secondary" @click="save(true)">Continuar</button>
      </div>
    </b-modal>
  </div>
</template>

<script>
import moment from 'moment'
import _ from 'lodash'
import log from 'loglevel'
import euroInput from '../PageElements/tables/euroInput'
import percentageInput from '../PageElements/tables/percentageInput'
import WorkService from '../../../services/WorkService'
import InvoiceService from '../../../services/InvoiceService'

export default {
	name: 'invoicePage',
	components: {
		euroInput,
		percentageInput
	},
	data() {
		return {
			imgLoaded: false,
			parentContainer: null,
			moneyFormatter: new Intl.NumberFormat('es-ES', {
				style: 'currency',
				currency: 'EUR'
			}),
			parentCallback: undefined,
			worksDeleted: [],
			worksUpdated: false
		}
	},
	props: {
		invoice: {
			type: Object,
			required: true
		},
		works: {
			type: Array,
			required: true
		},
		indications: {
			type: Array,
			required: true
		},
		pageNumber: {
			type: Number,
			required: true
		},
		isFirstPage: {
			type: Boolean,
			required: true
		},
		isLastPage: {
			type: Boolean,
			required: true
		},
		cssText: {
			type: String,
			required: true
		},
		logo: {
			type: String,
			required: true
		},
		vatNumber: {
			type: String,
			required: true
		},
		footer: {
			type: String,
			required: true
		},
		forPrinter: {
			type: Boolean,
			required: true
		},
		editing: {
			type: Boolean,
			required: true
		},
		appliedDiscount: {
			type: Number,
			required: true
		},
		appliedPercentageDiscount: {
			type: Number,
			required: true
		}
	},
	methods: {
		logoLoaded() {
			this.imgLoaded = true
		},
		waitLogo(callback) {
			if (callback !== undefined) {
				this.parentCallback = callback
			}
			if (!this.imgLoaded) {
				window.setTimeout(this.waitLogo, 500)
			} else {
				this.parentCallback(this.pageNumber)
			}
		},
		format(date) {
			return moment(date).format('DD/MM/YYYY')
		},
		printPdf() {
			const ipc = require('electron').ipcRenderer
			ipc.send('print-to-pdf')
		},
		deleteWork(idWork) {
			log.debug(`Work ${idWork} removed from invoice ${this.invoice.IdFactura} (${this.invoice.NumFactura})`)
			var deleted = _.remove(this.works, n => n.IdTrabajo === idWork)
			this.worksDeleted.push(deleted)
			this.updateGrandTotal()
			this.$forceUpdate()
		},
		updatePercentageDiscount(work) {
			work.TotalDescuento = (work.PrecioSinDescuento * work.PorcentajeDescuento) / 100
			work.PrecioFinalConDescuento = work.PrecioSinDescuento - work.TotalDescuento
			this.worksUpdated = true
			this.updateGrandTotal()
		},
		updateTotalDiscount(work) {
			work.PorcentajeDescuento = ((work.TotalDescuento * 100) / work.PrecioSinDescuento).toFixed(2)
			work.PrecioFinalConDescuento = work.PrecioSinDescuento - work.TotalDescuento
			this.worksUpdated = true
			this.updateGrandTotal()
		},
		updateGrandTotal() {
			this.invoice.Total = _.sumBy(this.works, 'PrecioFinalConDescuento')
		},
		save: async function(confirmed = false) {
			if (!confirmed) {
				this.$refs.editInvoiceModal.show()
				return
			}

			// First we remove the deleted works
			const worksDeleted = Object.values(this.worksDeleted)
			for (const n of worksDeleted) {
				var workId = n[0].IdTrabajo
				log.info(
					`Invoice edited. WorkId ${workId} removed from invoice ${this.invoice.IdFactura} (${this.invoice.NumFactura})`
				)
				await this.invoiceService.removeWorkFromInvoice(this.invoice.IdFactura, workId)
			}

			// Now we update the discounts of the remaining works
			for (const currentWork of this.works) {
				log.info(
					`Invoice edited. WorkId ${currentWork.IdTrabajo} updated from invoice ${this.invoice.IdFactura} (${
						this.invoice.NumFactura
					})`
				)
				await this.workService.updateWorkDiscount(
					currentWork.IdTrabajo,
					currentWork.PorcentajeDescuento,
					currentWork.TotalDescuento
				)
			}

			// We update the grand total of the invoice with all the changes applied.
			await this.invoiceService.updateInvoiceGrandTotal(this.invoice.IdFactura)

			// Finally, we dismiss the dialog and return to the previous page
			this.$refs.editInvoiceModal.hide()

			// Due to this instance is created dinamically, there's no $router available in the object. We need to use the parent's one.
			this.$parent.$router.push({
				path: '/finances'
			})
		}
	},
	created() {
		this.workService = new WorkService()
		this.invoiceService = new InvoiceService()
		log.debug('Created')
	},
	computed: {
		isDirty() {
			return this.worksDeleted.length !== 0 || this.worksUpdated
		},
		isError() {
			return false
		}
	}
}
</script>

<style>
@import url('~@/assets/css/printed.css');
@import url('~@/assets/css/bootstrap/css/bootstrap.min.css');
</style>
