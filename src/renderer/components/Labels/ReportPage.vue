<template>
  <div class="container printed pagebreak" :class="{'pageBorder': !forPrinter}">
    <div class="row">
      <div class="col-sm-6">
        <img @load="logoLoaded" :src="logo" class="mt-3" />
        <br />
        CIF: {{vatNumber}}
      </div>
      <!-- col-sm-6 -->
      <div class="col-sm-6">
        <h1 class="text-uppercase text-right mt-3">Resumen mensual</h1>
      </div>
      <!-- col-sm-6 -->
    </div>
    <!-- row -->
    <div class="row mt-2">
      <div class="col-sm-6">
        <h3 class="text-uppercase">Datos del resumen mensual</h3>
        <h5>Fecha: {{format(invoice.Fecha)}}</h5>
      </div>
      <!-- col-sm-6 -->
      <div class="col-sm-6">
        <div class="clientBox">
          <h3 class="text-uppercase">Cliente</h3>
          {{invoice.NombreDentista}}
          <br />
          {{invoice.NombreClinica}}
          <br />
          {{invoice.DatosFiscales}}
          <br />
          {{invoice.Direccion}}
          <br />
          {{invoice.CP}} {{invoice.Poblacion}}
        </div>
      </div>
      <!-- col-sm-6 -->
    </div>
    <!-- row -->
    <div class="row mt-5">
      <div class="col-sm-12">
        <!-- forPrinter -->
        <div style="height: 1075px;">
          <div
            v-if="!isFirstPage"
            class="text-right font-italic"
          >...continúa desde la página anterior.</div>
          <table class="table table-invoice" width="100%" cellspacing="0">
            <thead>
              <tr>
                <th class="text-left" style="width: 60%;">Concepto</th>
                <th class="text-right" style="width: 10%;">Cantidad</th>
                <th class="text-right" style="width: 10%;">P. Unidad</th>
                <th class="text-right" style="width: 10%;">% Dto.</th>
                <th class="text-right" style="width: 10%;">Dto.</th>
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
                    <br />
                    <span>{{work.Paciente}}</span>
                  </td>
                  <td class="text-right">1</td>
                  <td class="text-right">{{moneyFormatter.format(work.PrecioSinDescuento)}}</td>
                  <td class="text-right">{{work.PorcentajeDescuento.toFixed(2).replace('.', ',')}} %</td>
                  <td class="text-right">{{moneyFormatter.format(work.TotalDescuento)}}</td>
                  <td class="text-right">{{moneyFormatter.format(work.PrecioConDescuento)}}</td>
                </tr>
                <tr
                  class="leapTr dontBreakHere"
                  v-for="indication in indications[work.IdTrabajo]"
                  v-bind:key="indication.IdTrabajoDetalle"
                >
                  <td class="text-left">
                    <span class="text-monospace">{{indication.Descripcion}}</span>
                  </td>
                  <td class="text-right"></td>
                  <td class="text-right"></td>
                  <td class="text-right"></td>
                  <td class="text-right"></td>
                  <td class="text-right"></td>
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
            >Descuento aplicado: {{moneyFormatter.format(appliedDiscount)}}</div>
          </div>
          <div class="text-right font-italic" v-if="!isLastPage">...suma y sigue.</div>
        </div>
        <!-- end forPrinter -->
      </div>
      <!-- col-sm-12 -->
    </div>
    <!-- row -->
    <div class="text-right">Página {{pageNumber}}</div>
    <div class="fixed-bottom printed-1">
      <div class="text-justify printed">{{footer}}</div>
    </div>
  </div>
</template>

<script>
import moment from 'moment'

export default {
	name: 'reportPage',
	data() {
		return {
			imgLoaded: false,
			parentContainer: null,
			moneyFormatter: new Intl.NumberFormat('es-ES', {
				style: 'currency',
				currency: 'EUR'
			}),
			parentCallback: undefined
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
		}
	}
}
</script>

<style>
@import url('~@/assets/css/printed.css');
@import url('~@/assets/css/bootstrap/css/bootstrap.min.css');
</style>
