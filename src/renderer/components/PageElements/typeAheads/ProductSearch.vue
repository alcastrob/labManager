<template>
  <div class="input-group">
    <input
      type="text"
      class="form-control typeahead-input"
      placeholder="Buscar por nombre..."
      @keyup="search"
      v-model="query"
      v-on-clickaway="hidePopup"
      ref="producto"
      :class="{'is-invalid': isInvalid}"
      :disabled="$attrs.disabled === true"
    >
    <div v-if="canDisplayDropdown()" class="typeahead-dropdown list-group myTypeahead">
      <span class="list-group-item clickable" v-on:click="createNew">
        <i class="fas fa-plus-circle mr-1"></i>Crear nuevo producto y lote
      </span>
      <div v-for="product in candidateProductFromQuery" :key="product.IdProductoLote">
        <span
          class="list-group-item clickable"
          v-on:click="selectProduct(product.Descripcion, product.IdProductoLote)"
        >{{product.Descripcion}}</span>
      </div>
    </div>
  </div>
</template>

<script>
'use strict'

import ProductBatchService from '../../../../services/ProductBatchService'
import { mixin as clickaway } from 'vue-clickaway'

export default {
	name: 'productSearch',
	mixins: [clickaway],
	data() {
		return {
			resultsVisible: false,
			query: '',
			candidateProductFromQuery: [],
			focus: false
		}
	},
	props: ['value', 'isInvalid'],
	methods: {
		search: function() {
			this.resultsVisible = true
			this.focus = true
			if (this.query.length > 1) {
				this.productBatchService.searchProductsByName(this.query).then(productDetails => {
					this.candidateProductFromQuery = productDetails
				})
			} else {
				this.candidateProductFromQuery = []
				this.$emit('input', -1)
			}
		},
		selectProduct: function(name, id) {
			this.query = ''
			this.resultsVisible = false
			this.$emit('input', { IdProductoLote: id, Descripcion: name })
			this.$emit('change', null)
			this.hidePopup()
			this.$refs.producto.focus()
		},
		createNew: function() {
			this.productBatchService.searchProductByExactName(this.query).then(row => {
				if (row.length === 0) {
					// It's time to create the new product and batch
					this.productBatchService.insertProduct(this.query).then(id => {
						this.selectProduct(this.query, id)
					})
				}
			})
		},
		canDisplayDropdown: function() {
			this.resultVisible = this.query !== '' && this.focus
			return this.resultVisible
		},
		hidePopup: function() {
			this.focus = false
		},
		clear: function() {
			this.query = ''
		}
	},
	created() {
		this.productBatchService = new ProductBatchService()
	},
	mounted() {
		this.$refs.producto.focus()
	}
}
</script>

<style lang="scss">
@import url('~@/assets/css/typeaheadjs.css');
@import url('~@/assets/css/myTypeahead.css');
</style>
