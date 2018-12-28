<template>
  <div class="filter-bar ui basic segment grid">
    <div class="ui form mb-2 mt-3">
      <div class="inline field">
        <label class="mr-2">Filtrar por:</label>
        <input type="text" v-model="filterText" @keyup.enter="doFilter">
        <button class="ml-1 btn btn-secondary" @click="doFilter">Filtrar</button>
        <button class="ml-1 btn btn-outline-secondary" @click="resetFilter">Cancelar filtrado</button>
        <a href="#" data-toggle="collapse" data-target="#filter-options" class="pl-4"><i class="fas fa-filter"></i> Otras opciones de filtrado</a>
      </div>
      <div id="filter-options" class="collapse">
        <option-line id="fEntrada" :isMultiple="false" :options="['Hoy', 'Esta semana', 'Últimos 7 días', 'Últimos 15 días', 'Últimos 30 días', 'Este mes']" description="Fecha entrada: " ref="fEntrada">
        </option-line>
        <option-line id="fPrevista" :isMultiple="false" :options="['Hoy', 'Esta semana', 'Últimos 7 días', 'Últimos 15 días', 'Últimos 30 días', 'Este mes', 'Ninguna']" description="Fecha prevista: " ref="fPrevista">
        </option-line>
        <option-line id="fSalida" :isMultiple="false" :options="['Hoy', 'Esta semana', 'Últimos 7 días', 'Últimos 15 días', 'Últimos 30 días', 'Este mes', 'Ninguna o en el futuro']" description="Fecha terminación: " ref="fSalida">
        </option-line>
        <option-line id="tipo" :isMultiple="true" :options="['Fija', 'Resina', 'Ortodoncia', 'Esquelético', 'Zirconio', 'Compostura', 'Implante']" description="Tipo: " ref="tipo">
        </option-line>
      </div>
    </div>
  </div>
</template>

<script>
import optionButton from '../optionButton'
import optionLine from '../optionLine'
// import { throws } from 'assert';

export default {
  name: 'workFilterBar',
  components: {
    optionButton,
    optionLine
  },
  // props: {
  //   filterName: {
  //     type: String,
  //     required: false
  //   }
  // },
  data () {
    return {
      filterText: ''//,
      // filterName: ''
    }
  },
  methods: {
    doFilter () {
      this.$parent.applyTextFilter(this.filterText)
    },
    setFilterName (name) {
      switch (name){
      case 'receivedToday':
        this.$refs.fEntrada.clear()
        this.$refs.fEntrada.select('Hoy')
        this.$refs.fPrevista.clear()
        this.$refs.fSalida.clear()
        this.$refs.tipo.clear()
        // this.sendEventToWorksList()
        break
      case 'inProgress':
        this.$refs.fEntrada.clear()
        this.$refs.fPrevista.clear()
        this.$refs.fSalida.clear()
        this.$refs.fSalida.select('Ninguna o en el futuro')
        this.$refs.tipo.clear()
        // this.sendEventToWorksList()
        break
      case 'closedThisMonth':
        this.$refs.fEntrada.clear()
        this.$refs.fPrevista.clear()
        this.$refs.fSalida.clear()
        this.$refs.fSalida.select('Este mes')
        this.$refs.tipo.clear()
        // this.sendEventToWorksList()
        break
      case 'closedLast30days':
        this.$refs.fEntrada.clear()
        this.$refs.fPrevista.clear()
        this.$refs.fSalida.clear()
        this.$refs.fSalida.select('Últimos 30 días')
        this.$refs.tipo.clear()
        // this.sendEventToWorksList()
        break
      case null:
      case '':
      case undefined:
        this.$refs.fEntrada.clear()
        this.$refs.fPrevista.clear()
        this.$refs.fSalida.clear()
        this.$refs.tipo.clear()
        break
      default:
        throw 'Not recognized filter name: ' + this.filterName
    }
    },
    resetFilter () {
      this.filterText = ''
      this.$refs.fEntrada.clear()
      this.$refs.fPrevista.clear()
      this.$refs.fSalida.clear()
      this.$refs.tipo.clear()
      this.$parent.applyTextFilter(this.filterText)
      // this.sendEventToWorksList()
    },
    processFilterChange() {
      this.$parent.processFilterChange({
        fEntrada: this.$refs.fEntrada.getSelected(),
        fPrevista: this.$refs.fPrevista.getSelected(),
        fSalida: this.$refs.fSalida.getSelected(),
        tipo: this.$refs.tipo.getSelected()
      })
    }
    // sendEventToWorksList() {
    //   this.$root.$emit('worksFilter:updated', {
    //     fEntrada: this.$refs.fEntrada.getSelected(),
    //     fPrevista: this.$refs.fPrevista.getSelected(),
    //     fSalida: this.$refs.fSalida.getSelected(),
    //     tipo: this.$refs.tipo.getSelected()
    //   })
    // }
  },
  mounted () {
    // this.$root.$on('optionLine:' + this.$refs.fEntrada.$attrs.id + ':updatedFilter', this.sendEventToWorksList)
    // this.$root.$on('optionLine:' + this.$refs.fPrevista.$attrs.id + ':updatedFilter', this.sendEventToWorksList)
    // this.$root.$on('optionLine:' + this.$refs.fSalida.$attrs.id + ':updatedFilter', this.sendEventToWorksList)
    // this.$root.$on('optionLine:' + this.$refs.tipo.$attrs.id + ':updatedFilter', this.sendEventToWorksList)
  }
}
</script>