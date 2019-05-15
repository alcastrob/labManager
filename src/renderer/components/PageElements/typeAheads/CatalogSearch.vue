<template>
  <div>
    <input
      type="text"
      class="typeahead-input inputInTd"
      @keyup="search"
      @keydown.9="selectEntry()"
      @keydown.13="selectEntry(true)"
      @keydown.38.prevent="entryUp"
      @keydown.40.prevent="entryDown"
      v-model="$v.query.$model"
      ref="descripcion"
      :disabled="$attrs.disabled === true"
      :class="{'bg-danger text-white animated flash': !value && !query && !canBeEmpty}"
      @blur="selectEntry()"
    >
    <div v-if="canDisplayDropdown()" class="typeahead-dropdown list-group myTypeahead popup">
      <div
        v-for="(catalogItem, index) in candidateCatalogItemsFromQuery"
        :key="catalogItem.IdElementoCatalogo"
      >
        <span
          class="list-group-item clickable"
          :class="{'selected': isSelected(index)}"
          v-on:click="selectCatalogItem(catalogItem.Descripcion, catalogItem.IdElementoCatalogo, catalogItem.Precio, true)"
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
import _ from 'lodash'
import typeaheadMixin from './typeAheadMixin'
import { required } from 'vuelidate/lib/validators'

const MINIMUMQUERYLENGTH = 4

export default {
	name: 'catalogSearch',
	mixins: [typeaheadMixin],
	data() {
		return {
			resultsVisible: false,
			query: '',
			candidateCatalogItemsFromQuery: [],
			tooManyCandidates: false,
			notVisibleItems: 0,
			selectedItemPosition: 0,
			gotFocus: false
		}
	},
	props: ['value', 'canBeEmpty'],
	validations: {
		query: {
			required
		}
	},
	methods: {
		search: async function() {
			this.gotFocus = true
			if (this.query.length > MINIMUMQUERYLENGTH) {
				this.resultsVisible = true
				var items = await this.catalogService.searchCatalogEntriesByName(this.query)
				if (items.length === 1) {
					// Perfect match. Ensure to select this item in advance
					this.$emit('input', { IdElementoCatalogo: items[0].IdElementoCatalogo, Descripcion: items[0].Descripcion })
					this.candidateCatalogItemsFromQuery = items
					this.tooManyCandidates = false
					this.notVisibleItems = 0
					return
				}

				this.candidateCatalogItemsFromQuery = _.slice(items, 0, 5)
				this.tooManyCandidates = items.length > 5
				this.notVisibleItems = items.length - 5
			} else {
				this.resultsVisible = false
				this.tooManyCandidates = false
				this.notVisibleItems = 0
				this.candidateCatalogItemsFromQuery = []
				this.$emit('input', '')
			}
		},
		selectCatalogItem: function(name, id, price, requiresExtraTab) {
			this.query = name
			this.resultsVisible = false

			let changeEvent = { IdElementoCatalogo: id, Descripcion: name }
			if (price) changeEvent.Precio = price
			this.$emit('input', changeEvent)
			this.$emit('change', changeEvent)
			this.gotFocus = false
			if (requiresExtraTab) {
				// This method works in all the rows of the table, so doing this
				// indirection via refs is quite complicated.
				this.$vnode.elm.parentNode.nextElementSibling.childNodes[0].focus()
			}
		},
		selectEntry: function(needExtraTab, source) {
			if (!this.resultsVisible) return
			let entry = this.candidateCatalogItemsFromQuery[this.selectedItemPosition]

			let queryAndFirstResultAreEqual = false
			if (this.candidateCatalogItemsFromQuery.length > 0) {
				queryAndFirstResultAreEqual = this.query === this.candidateCatalogItemsFromQuery[0].Descripcion
			}

			if (entry && needExtraTab) {
				this.selectCatalogItem(entry.Descripcion, entry.IdElementoCatalogo, entry.Precio, true)
				return
			}
			if (entry && queryAndFirstResultAreEqual) {
				this.selectCatalogItem(entry.Descripcion, entry.IdElementoCatalogo, entry.Precio, false)
			} else {
				this.selectCatalogItem(this.query, null, null, false)
			}
		},
		entryUp: function() {
			if (!this.resultsVisible) return
			if (this.candidateCatalogItemsFromQuery === 1) {
				this.selectedItemPosition = 0
				return
			}
			this.selectedItemPosition =
				this.selectedItemPosition === 0 ? this.candidateCatalogItemsFromQuery.length - 1 : this.selectedItemPosition - 1
		},
		entryDown: function() {
			if (!this.resultsVisible) return
			if (this.candidateCatalogItemsFromQuery === 1) {
				this.selectedItemPosition = 0
				return
			}
			this.selectedItemPosition = (this.selectedItemPosition + 1) % this.candidateCatalogItemsFromQuery.length
		},
		isSelected: function(catalogItem) {
			return catalogItem === this.selectedItemPosition
		},
		canDisplayDropdown: function() {
			this.resultsVisible = this.query && this.query.length > MINIMUMQUERYLENGTH && this.gotFocus
			return this.resultsVisible
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
		this.query = this.value
	}
}
</script>

<style>
.inputInTd {
	width: 100%;

	padding: 10px;
	margin: 0px;
	box-sizing: border-box;
	-moz-box-sizing: border-box;
	-webkit-box-sizing: border-box;

	position: absolute;
	top: 0px;
	height: 100%;

	border: 0px;
	background: transparent;
}
</style>