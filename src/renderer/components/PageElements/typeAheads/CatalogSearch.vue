<template>
  <div>
    <input
      type="text"
      class="typeahead-input inputInTd"
      placeholder="Buscar producto..."
      @keyup="search"
      @keydown.9="hidePopup"
      @keydown.13="selectEntry"
      @keydown.38.prevent="entryUp"
      @keydown.40.prevent="entryDown"
      v-model="query"
      ref="descripcion"
      v-on-clickaway="hidePopup"
      :class="{'is-invalid': isInvalid}"
      :disabled="$attrs.disabled === true"
      :blur="hidePopup"
    >
    <div v-if="canDisplayDropdown()" class="typeahead-dropdown list-group myTypeahead popup">
      <div
        v-for="(catalogItem, index) in candidateCatalogItemsFromQuery"
        :key="catalogItem.IdElementoCatalogo"
      >
        <span
          class="list-group-item clickable"
          :class="{'selected': isSelected(index)}"
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

const MINIMUMQUERYLENGTH = 4

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
			selectedItemPosition: 0,
			gotFocus: false
		}
	},
	props: ['value', 'isInvalid'],
	methods: {
		search: async function() {
			this.gotFocus = true
			if (this.query.length > MINIMUMQUERYLENGTH) {
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
			}
			this.$emit('input', -1)
		},
		selectCatalogItem: function(name, id, continueWithPopup) {
			this.query = name
			this.resultsVisible = false
			this.$emit('input', { IdElementoCatalogo: id, Descripcion: name })
			this.$emit('change', _.find(this.candidateCatalogItemsFromQuery, ['IdElementoCatalogo', id]))
			if (!continueWithPopup) {
				this.hidePopup(true)
			}
			// this.$refs.descripcion.focus()
		},
		canDisplayDropdown: function() {
			this.resultVisible = this.query && this.query.length > MINIMUMQUERYLENGTH && this.gotFocus
			return this.resultVisible
		},
		hidePopup: function(alreadyEmitted) {
			if (!this.resultVisible) return

			// alreadyEmmited values can be 'true', 'undefined' or even an event.
			if (alreadyEmitted !== true && this.candidateCatalogItemsFromQuery.length === 1) {
				// It's almost the perfect candidate. Let's select it in advance
				let item = this.candidateCatalogItemsFromQuery[0]
				this.$emit('input', { IdElementoCatalogo: item.IdElementoCatalogo, Descripcion: item.Descripcion })
				this.$emit('change', item)
				console.log('emmited', item)
			}
			this.gotFocus = false
		},
		selectEntry: function() {
			if (!this.resultsVisible) return
			var x = this.candidateCatalogItemsFromQuery[this.selectedItemPosition]
			this.selectCatalogItem(x.Descripcion, x.IdElementoCatalogo)
		},
		entryUp: function() {
			if (!this.resultsVisible) return
			this.selectedItemPosition = this.selectedItemPosition === 0 ? 4 : this.selectedItemPosition - 1
		},
		entryDown: function() {
			if (!this.resultsVisible) return
			this.selectedItemPosition = (this.selectedItemPosition + 1) % 5
		},
		isSelected: function(catalogItem) {
			return catalogItem === this.selectedItemPosition
		},
		clear: function() {
			this.query = ''
			this.selectedItemPosition = 0
		},
		focus: function() {
			this.$refs.descripcion.focus()
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
.popup {
	position: absolute;
	top: 50px;
}
.selected {
	background-color: #f4ecd6;
}
</style>
