<template>
  <div class="filter-bar ui basic segment grid">
    <div class="ui form mb-2 mt-3">
      <div class="inline field">
        <label class="mr-2">Filtrar por:</label>
        <input type="text" v-model="filterText" @keyup.enter="doFilter">
        <button class="ml-1 btn btn-secondary" @click="doFilter">Filtrar</button>
        <button class="ml-1 btn btn-outline-secondary" @click="resetFilter">Cancelar filtrado</button>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import log from 'loglevel'

export default {
	name: 'filterBar',
	data() {
		return {
			filterText: ''
		}
	},
	methods: {
		doFilter() {
			this.$parent.applyTextFilter(this.filterText)
			this.resetPagination()
			log.debug(`Filter used in table ${this.$parent.$vnode.componentOptions.tag} set to ${this.filterText}.`)
		},
		resetFilter() {
			this.filterText = ''
			this.$parent.applyTextFilter(this.filterText)
			this.resetPagination()
			log.debug(`Filter used in table ${this.$parent.$vnode.componentOptions.tag} cancelled.`)
		},
		resetPagination() {
			// Try to figure out if the parent component has a pagination control, and if so, reset it to page 1
			var pagination = _.find(this.$parent.$children, o => {
				return o.$options._componentTag === 'pagination'
			})
			if (pagination !== undefined) {
				pagination.loadPage(1)
			}
		}
	}
}
</script>