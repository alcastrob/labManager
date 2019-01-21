<template>
  <div class="filter-bar ui basic segment grid">
    <div class="ui form mb-2 mt-3">
      <div class="inline field">
        <label class="mr-2">Filtrar por:</label>
        <input type="text" v-model="filterText" @keyup.enter="doFilter">
        <button class="ml-1 btn btn-secondary" @click="doFilter">Filtrar</button>
        <button class="ml-1 btn btn-outline-secondary" @click="resetFilter">Cancelar filtrado</button>
        <a href="#" data-toggle="collapse" data-target="#filter-options" class="pl-4 text-info"><i class="fas fa-filter"></i>Otros filtros</a>
      </div>
      <div id="filter-options" class="collapse mt-2">
        <option-line id="fFactura" :isMultiple="false" :options="['Hoy', 'Este mes', 'Mes pasado', 'Hace dos meses', 'Hace tres meses', 'Hace seis meses']" description="Fecha factura: " ref="fFactura">
        </option-line>
        <div class="row mt-2 mb-4">
          <div class="col-md-6">
            <label for="fInicio">Fecha inicio:</label>
            <input type="date" class="form-control" id="fInicio" placeholder="dd/mm/aaaa" ref="fInicio" @change="dateChanged">
          </div>
          <div class="col-md-6">
            <label for="fFin">Fecha fin:</label>
            <input type="date" class="form-control" id="fFin" placeholder="dd/mm/aaaa" ref="fFin" @change="dateChanged">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import optionButton from '../optionButton'
import optionLine from '../optionLine'

export default {
  name: 'workFilterBar',
  components: {
    optionButton,
    optionLine
  },
  data () {
    return {
      filterText: ''
    }
  },
  methods: {
    doFilter () {
      this.$parent.applyTextFilter(this.filterText)
    },
    // setFilterName (name) {
    //   switch (name){
    //     case 'receivedToday':
    //       this.$refs.fFactura.clear()
    //       break
    //     case null:
    //     case '':
    //     case undefined:
    //       this.$refs.fFactura.clear()
    //       break
    //     default:
    //       throw 'Not recognized filter name: ' + this.filterName
    //   }
    // },
    resetFilter () {
      this.filterText = ''
      this.$refs.fInicio.value = ''
      this.$refs.fFin.value = ''
      this.$refs.fFactura.clear()
      this.$parent.applyTextFilter(this.filterText)
      this.processFilterChange()
    },
    processFilterChange(filterData) {
      this.$refs.fInicio.value = ''
      this.$refs.fFin.value = ''
      this.$parent.processFilterChange({
        fFactura: this.$refs.fFactura.getSelected()
      })
    },
    dateChanged() {
      this.$refs.fFactura.clear()
      this.$parent.processFilterChange({
        fInicio: (this.$refs.fInicio.value === '')?undefined:this.$refs.fInicio.value,
        fFin: (this.$refs.fFin.value === '')?undefined:this.$refs.fFin.value
      })
    }
  }
}
</script>