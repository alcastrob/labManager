<template>
	<div class="container printed-1">
		<div class="row">
			<div class="col-sm-6">
				<h1 class="text-uppercase">Historia de seguimiento postcomercialización</h1>
				<br />
			</div>
			<div class="col-sm-6">
				<img @load="logoLoaded" :src="logo" />
				<br />
			</div>
		</div>
		<!-- row -->
		<div class="row">
			<div class="col-sm-12">
				Licencia de Fabricante de productos sanitarios nº: {{Maker}}
				<br />
				Colegiados: {{ColNumber}}
				<br />
				Nº Trabajo:
				{{IdTrabajo}}
				<br />
				Identificación del producto: {{ProductType}}
			</div>
		</div>
		<!-- row -->

		<div class="row pt-4">
			<div class="col-sm-12">
				<table class="table table-bordered" width="95%" cellspacing="0">
					<tr>
						<th width="10%">Fecha</th>
						<th width="45%">Actuación</th>
						<th width="45%">Firma</th>
					</tr>
					<tr v-for="logEntry in PostSales" v-bind:key="logEntry.IdPostVenta">
						<td>{{ format(logEntry.Fecha) }}</td>
						<td>{{ logEntry.Actuacion }}</td>
						<td>{{ logEntry.Nombre }}<br><br><br><br></td>
					</tr>
				</table>
			</div>
			<!-- col-sm-12 -->
		</div>
		<!-- row -->
		<div class="row">
			<div class="col-sm-12">
				<div class="fixed-bottom printed-1" >
					<div class="text-justify printed">
						<span
						>Este documento recoge las actuaciones llevadas a cabo por el técnico responsable sobre el producto sanitario,
						dando cumplimiento a su obligación como fabricante al seguimiento poscomercialización, recogido en el
						Reglamento UE 2017/745 del Parlamento Europeo y del Consejo, de 5 de abril de 2017, sobre los productos
						sanitarios.</span
						>
					</div>
				</div>
			</div>
			<!-- col-sm-12 -->
		</div>
		<!-- row -->
	</div>
</template>

<script>
import moment from 'moment'
import { Printd } from 'printd'
var path = require('path')
var fs = require('fs')

export default {
	name: 'postSales',
	data() {
		return {
			cssText: '',
			moneyFormatter: new Intl.NumberFormat('es-ES', {
				style: 'currency',
				currency: 'EUR'
			}),
			imgLoaded: false,
			container: null
		}
	},
	props: {
		IdTrabajo: {
			type: Number,
			required: true
		},
		PostSales: {
			type: Object,
			required: true
		},
		ProductType: {
			type: String,
			required: true
		},
		Maker: {
			type: String,
			required: true
		},
		ColNumber: {
			type: String,
			required: true
		},
		logo: {
			type: String,
			required: true
		}
	},
	methods: {
		logoLoaded() {
			this.imgLoaded = true
		},
		print(container) {
			this.container = container
			this.container.appendChild(this.$el)
			this.waitLogoAndPrint()
		},
		waitLogoAndPrint() {
			if (!this.imgLoaded) {
				window.setTimeout(this.waitLogoAndPrint, 1000)
			} else {
				this.$forceUpdate()
				const d = new Printd()
				d.print(this.$el, this.cssText)
				this.container.removeChild(this.$el)
			}
		},
		format(fecha) {
			return moment(fecha).format('DD/MM/YYYY')
		}
	},
	mounted() {
		this.cssText = fs.readFileSync(path.resolve(__static, 'printed.css'), 'UTF-8')
		this.cssText += fs.readFileSync(path.resolve(__static, 'bootstrap.min.css'), 'UTF-8')
	}
}
</script>

<style>
@import url('~@/assets/css/printed.css');
@import url('~@/assets/css/bootstrap/css/bootstrap.min.css');
</style>
