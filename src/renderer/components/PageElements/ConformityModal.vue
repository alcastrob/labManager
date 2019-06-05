<template>
  <div>
    <b-modal ref="conformityModal" title="Declaración de Conformidad" hide-footer>
      <div class="modal-body">
        <span
          v-if="!editing"
        >Este trabajo no tiene una declaración de conformidad previa, por lo que se va a crear una. Por favor, indique los productos y lotes usados en este trabajo, así como el número de meses que aplica la garantía.</span>
        <span
          v-else
        >Este trabajo ya tiene una declaración de conformidad previa. Cualquier cambio que haga en esta información se guardará al imprimir de nuevo la declaración.</span>
        <br>
        <label for="meses" class="pt-4">Número de meses de garantía</label>
        <input
          type="number"
          name="meses"
          v-model="$v.warrantyPeriod.$model"
          class="form-control"
          :class="{'is-invalid': $v.warrantyPeriod.$error}"
          @change="isDirty=true"
        >
        <small
          class="text-danger"
          v-if="$v.warrantyPeriod.$error"
        >Es necesario especificar un número entero y positivo de meses.</small>
        <label for="tablaProductos" class="pt-3">Productos y Lotes incluidos</label>
        <ul v-if="batches.length>0">
          <li v-for="batch in batches" v-bind:key="batch.IdProductoLote" class="batchLine">
            {{batch.Descripcion}}
            <i
              class="fas fa-times-circle"
              @click="deleteBatch(batch.IdProductoLote)"
            ></i>
          </li>
        </ul>
        <div v-else class="pl-5 text-danger">
          Ninguno
          <br>
        </div>
        <label for="nombreProductoABuscar" class="pt-3">Producto y lote a añadir</label>
        <productSearch
          name="nombreProductoABuscar"
          @change="addBatch()"
          v-model="batchQueryResult"
          ref="productSearch"
        ></productSearch>
        <label
          for="productoEspecifico"
          class="pt-4"
        >Producto específico para esta declaración de conformidad</label>
        <input
          type="text"
          name="productoEspecifico"
          v-model="specificProduct"
          class="form-control"
          @change="isDirty=true"
        >
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" @click="$refs.conformityModal.hide()">
          <i class="fas fa-times-circle mr-2 position-relative" style="top: 1px;"></i>Cancelar
        </button>
        <button
          v-if="!editing"
          class="btn btn-secondary"
          :disabled="warrantyPeriod === '' || $v.warrantyPeriod.$error"
          @click="createDeclarationOfConformity"
        >
          <i class="fas fa-print mr-2 position-relative" style="top: 1px;"></i>Crear e imprimir
        </button>
        <button
          v-else
          class="btn btn-secondary"
          :disabled="warrantyPeriod === '' || $v.warrantyPeriod.$error"
          @click="updateDeclarationOfConformity"
        >
          <i class="fas fa-print mr-2 position-relative" style="top: 1px;"></i>Imprimir y guardar
        </button>
      </div>
    </b-modal>
    <div ref="labelContainer" class="visuallyhidden"></div>
  </div>
</template>

<script>
'use strict'

import Vue from 'vue'
import _ from 'lodash'
import log from 'loglevel'
import { integer, minValue } from 'vuelidate/lib/validators'
import ConformityDeclarationService from '../../../services/ConformityDeclarationService'
import conformityLabel from '../Labels/Conformity'
// eslint-disable-next-line
import bModal from 'bootstrap-vue'
import productSearch from '../PageElements/typeAheads/ProductSearch'

export default {
	name: 'conformityModal',
	components: {
		conformityLabel,
		productSearch
	},
	props: {
		work: {
			type: Object,
			required: true
		}
	},
	data() {
		return {
			batches: [],
			batchQueryResult: '',
			declarationId: -1,
			warrantyPeriod: 12,
			date: '',
			specificProduct: '',
			isDirty: false,
			makerNumber: '',
			personInCharge: '',
			companyName: '',
			logo: '',
			editing: false
		}
	},
	validations: {
		warrantyPeriod: {
			integer,
			minValue: minValue(0)
		}
	},
	methods: {
		show() {
			this.date = ''
			this.batches = []
			this.batchQueryResult = ''
			this.$refs.productSearch.clear()
			this.warrantyPeriod = 12
			this.specificProduct = ''
			this.declarationId = -1
			this.isDirty = false
			this.logo = ''
			this.$refs.conformityModal.show()
			this.getDeclarationOfConformity()
		},
		hide() {
			this.$refs.conformityModal.hide()
		},
		getDeclarationOfConformity: async function() {
			const conformityDeclarationService = new ConformityDeclarationService()
			var declaration = await conformityDeclarationService.getConformityDeclaration(this.work.IdTrabajo)
			var config = await conformityDeclarationService.getConfigValues([
				'makerNumber',
				'personInCharge',
				'companyName',
				'logo'
			])

			// 1. Get the config data first
			this.makerNumber = _.find(config, ['clave', 'makerNumber']).valor
			this.personInCharge = _.find(config, ['clave', 'personInCharge']).valor
			this.companyName = _.find(config, ['clave', 'companyName']).valor
			this.logo = _.find(config, ['clave', 'logo']).valor

			// 2. Now check if the note exists -> Use its data
			if (declaration.data !== undefined) {
				this.editing = true
				this.declarationId = declaration.data.IdDeclaracion
				this.date = declaration.data.Fecha
				this.warrantyPeriod = declaration.data.Meses
				this.specificProduct = declaration.data.ProductoEspecifico
				this.batches = _.map(declaration.details, value => {
					return {
						IdProductoLote: value.IdProductoLote,
						Descripcion: value.Descripcion
					}
				})
			} else {
				// 3. If not, ask the user for the warranty period and the batches and products, and create the note.
				this.editing = false
			}
			this.$refs.conformityModal.show()
		},
		createDeclarationOfConformity: async function() {
			const conformityDeclarationService = new ConformityDeclarationService()
			await conformityDeclarationService.insertConformityDeclaration(
				{
					IdTrabajo: this.work.IdTrabajo,
					Meses: this.warrantyPeriod,
					Fecha: this.work.FechaTerminacion,
					ProductoEspecifico: this.specificProduct
				},
				_.map(this.batches, 'IdProductoLote')
			)
			var row = await conformityDeclarationService.getConformityDeclaration(this.work.IdTrabajo)
			this.print(row)
			log.info(`Conformity Declaration for work ${this.work.IdTrabajo} was printed`)
			this.hide()
		},
		updateDeclarationOfConformity: async function() {
			const conformityDeclarationService = new ConformityDeclarationService()
			if (this.isDirty) {
				var dec = {
					IdDeclaracion: this.declarationId,
					Meses: this.warrantyPeriod,
					ProductoEspecifico: this.specificProduct
				}
				await conformityDeclarationService.updateConformityDeclaration(dec, _.map(this.batches, 'IdProductoLote'))
				var row = await conformityDeclarationService.getConformityDeclaration(this.work.IdTrabajo)
				this.print(row)
				this.hide()
			} else {
				// No real updates, just print
				var row = await conformityDeclarationService.getConformityDeclaration(this.work.IdTrabajo)
				this.print(row)
				log.info(`Updated Conformity Declaration for work ${this.work.IdTrabajo} was printed`)
				this.hide()
			}
		},
		print(conformity) {
			var ComponentClass = Vue.extend(conformityLabel)
			var instance = new ComponentClass({
				propsData: {
					conformityDeclaration: conformity.data,
					conformityDeclarationDetails: conformity.details,
					makerNumber: this.makerNumber,
					personInCharge: this.personInCharge,
					companyName: this.companyName,
					logo: 'data:image/png;base64,' + this.logo
				}
			})
			instance.$mount()
			instance.print(this.$refs.labelContainer)
		},
		deleteBatch(idProductoLote) {
			this.batches = _.remove(this.batches, function(element) {
				return element.IdProductoLote !== idProductoLote
			})
			this.isDirty = true
		},
		addBatch() {
			if (_.find(this.batches, ['IdProductoLote', this.batchQueryResult.IdProductoLote]) === undefined) {
				this.batches.push(this.batchQueryResult)
				this.isDirty = true
			}
		}
	}
}
</script>

<style>
.batchLine i {
	visibility: hidden;
}

.batchLine:hover i {
	visibility: visible;
}
</style>
