<template>
  <div>
    <input
      type="text"
      class="typeahead-input inputInTd"
      placeholder="Buscar producto..."
      @keyup="search"
      v-model="query"
      ref="descripcion"
      :class="{'is-invalid': isInvalid}"
      :disabled="$attrs.disabled === true"
    >
    <div v-if="canDisplayDropdown()" class="typeahead-dropdown list-group myTypeahead target">
      <div
        v-for="catalogItem in candidateCatalogItemsFromQuery"
        :key="catalogItem.IdElementoCatalogo"
      >
        <span
          class="list-group-item clickable"
          v-on:click="selectCatalogItem(catalogItem.Descripcion, catalogItem.IdElementoCatalogo)"
        >{{catalogItem.Descripcion}}</span>
      </div>
      <div v-if="tooManyCandidates">
        <span
          v-if="notVisibleItems > 1"
          class="list-group-item text-right"
        >...omitidos {{notVisibleItems}} resultados...</span>
        <span v-else class="list-group-item text-right">...omitido 1 resultado...</span>
      </div>
    </div>
  </div>
</template>

<script>
'use strict'

import CatalogService from '../../../../services/CatalogService'
import { mixin as clickaway } from 'vue-clickaway'
import _ from 'lodash'

export default {
	name: 'catalogSearch',
	mixins: [clickaway],
	data() {
		return {
			resultsVisible: false,
			query: '',
			selectedCatalogItemId: undefined,
			candidateCatalogItemsFromQuery: [],
			tooManyCandidates: false,
			notVisibleItems: 0,
			gotFocus: false
		}
	},
	props: ['value', 'isInvalid'],
	methods: {
		search: async function() {
			this.gotFocus = true
			if (this.query.length > 4) {
				this.resultsVisible = true
				var items = await this.catalogService.searchCatalogEntriesByName(this.query)
				this.candidateCatalogItemsFromQuery = _.slice(items, 0, 5)
				this.tooManyCandidates = items.length > 5
				this.notVisibleItems = items.length - 5
			} else {
				this.resultsVisible = false
				this.tooManyCandidates = false
				this.notVisibleItems = 0
				this.candidateCatalogItemsFromQuery = []
				this.$emit('input', -1)
			}
		},
		selectCatalogItem: function(name, id) {
			this.query = name
			this.resultsVisible = false
			this.$emit('input', { IdElementoCatalogo: id, Descripcion: name })
			this.$emit('change', null)
			this.hidePopup()
			this.$refs.descripcion.focus()
		},
		canDisplayDropdown: function() {
			this.resultVisible = this.query && this.gotFocus
			return this.resultVisible
		},
		hidePopup: function() {
			this.gotFocus = false
		},
		clear: function() {
			this.query = ''
		}
	},
	created() {
		this.catalogService = new CatalogService()
	}
}
</script>

<style lang="scss">
@import url('~@/assets/css/typeaheadjs.css');
@import url('~@/assets/css/myTypeahead.css');
.target {
	position: absolute;
	// left: 50px;
	top: 50px;
	// border: 2px solid black;
	// background-color: #ddd;
}
</style>
