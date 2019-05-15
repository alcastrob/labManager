<template>
  <div @blur="selectEntry">
    <input
      type="text"
      class="typeahead-input inputInTd"
      @keyup="search"
      @keydown.9="selectEntry"
      @keydown.13="selectEntry(true)"
      @keydown.38.prevent="entryUp"
      @keydown.40.prevent="entryDown"
      v-model="$v.query.$model"
      ref="descripcion"
      :class="{'is-invalid': isInvalid}"
      :disabled="$attrs.disabled === true"
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
import { mixin as clickaway } from 'vue-clickaway'
import _ from 'lodash'
import { required } from 'vuelidate/lib/validators'

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
			gotFocus: false,
			lastEmmited: ''
		}
	},
	props: ['value', 'isInvalid'],
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

			// debugger
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
		canDisplayDropdown: function() {
			this.resultsVisible = this.query && this.query.length > MINIMUMQUERYLENGTH && this.gotFocus
			return this.resultsVisible
		},
		hidePopupKK: function(selectedViaClick) {
			// alreadyEmmited values can be 'true', 'undefined' or even an event.
			// let notEmitted = alreadyEmitted !== true
			// Match between query and suggestion
			// let onlyOneResult = this.candidateCatalogItemsFromQuery.length === 1
			let queryAndFirstResultAreEqual = false
			if (this.candidateCatalogItemsFromQuery.length > 0) {
				queryAndFirstResultAreEqual = this.query === this.candidateCatalogItemsFromQuery[0].Descripcion
			}

			if (this.gotFocus && !this.$v.query.$anyDirty) {
				// this.$emit('change', { src: this })
				console.log('a')
				this.$emit('change', {})
				this.gotFocus = false
				return
			}

			if (!this.$v.query.$anyDirty || !this.query || this.lastEmmited === this.query) {
				console.log('b')
				this.gotFocus = false
				return
			}

			if (selectedViaClick) {
				let item = this.candidateCatalogItemsFromQuery[0]
				this.$emit('input', { IdElementoCatalogo: item.IdElementoCatalogo, Descripcion: item.Descripcion })
				let changeEvent = { ...item }
				changeEvent.src = this
				this.$emit('change', changeEvent)
				this.lastEmmited = item.Descripcion
				this.gotFocus = false
				return
			}
			// debugger
			if (queryAndFirstResultAreEqual) {
				// It's almost the perfect candidate. Let's select it in advance
				let item = this.candidateCatalogItemsFromQuery[0]
				this.$emit('input', { IdElementoCatalogo: item.IdElementoCatalogo, Descripcion: item.Descripcion })
				let changeEvent = { ...item }
				// changeEvent.src = this
				this.$emit('change', changeEvent)
				this.lastEmmited = item.Descripcion
				this.gotFocus = false
				// return
			} else {
				// It's an uncatalogued item
				this.$emit('input', { IdElementoCatalogo: null, Descripcion: this.query })
				this.$emit('change', { IdElementoCatalogo: null, Descripcion: this.query, Precio: 0, src: this })
				// this.$emit('change', { IdElementoCatalogo: null, Descripcion: this.query, Precio: 0 })
				this.lastEmmited = this.query
				this.gotFocus = false
				// return
			}

			// this.gotFocus = false
		},
		selectEntry: function(needExtraTab) {
			if (!this.resultsVisible) return
			let entry = this.candidateCatalogItemsFromQuery[this.selectedItemPosition]

			let queryAndFirstResultAreEqual = false
			if (this.candidateCatalogItemsFromQuery.length > 0) {
				queryAndFirstResultAreEqual = this.query === this.candidateCatalogItemsFromQuery[0].Descripcion
			}

			// debugger
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
