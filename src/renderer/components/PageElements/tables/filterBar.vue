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
export default {
  name: 'filterBar',
  data () {
    return {
      filterText: ''
    }
  },
  methods: {
    doFilter () {
      this.$parent.applyTextFilter(this.filterText)
      this.resetPagination()
    },
    resetFilter () {
      this.filterText = ''
      this.$parent.applyTextFilter(this.filterText)
      this.resetPagination()
    },
    resetPagination () {
      // Try to figure out if the parent component has a pagination control, and if so, reset it to page 1
      var pagination = _.find(this.$parent.$children, (o) => {
        return o.$options._componentTag === 'pagination'
      })
      if (pagination !== undefined) {
        pagination.loadPage(1)
      }
    }
  }
}
</script>