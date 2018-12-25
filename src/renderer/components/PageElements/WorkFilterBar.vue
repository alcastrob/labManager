<template>
  <div class="filter-bar ui basic segment grid">
    <div class="ui form mb-2 mt-3">
      <div class="inline field">
        <label class="mr-2">Filtrar por:</label>
        <input type="text" v-model="filterText" @keyup.enter="doFilter">
        <button class="ml-1 btn btn-secondary" @click="doFilter">Filtrar</button>
        <button class="ml-1 btn btn-outline-secondary" @click="resetFilter">Cancelar filtrado</button>
      </div>
      <br>
      Fecha Entrada:
      Fecha Prevista:
      Fecha Salida:
      Tipo:
    </div>
  </div>
</template>

<script>
export default {
  name: 'workFilterBar',
  data () {
    return {
      filterText: ''
    }
  },
  methods: {
    doFilter () {
      this.$parent.applyFilter(this.filterText)
    },
    resetFilter () {
      this.filterText = ''
      this.$parent.applyFilter(this.filterText)
    }
  }
}
</script>