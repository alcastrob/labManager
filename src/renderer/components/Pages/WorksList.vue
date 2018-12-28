<template>
  <div class="container">
    <div class="row">
      <div class="col-md-6">
        <h1 v-if="showCustomHeader">{{listHeading}}</h1>
        <h1 v-else>Listado de Trabajos</h1>
      </div>
    </div> <!-- row -->
    <div>
      <workExtendedTable :headers="headers" :searchFields="searchFields" ref="table" urlBase="/works/details/"/>
    </div>
  </div>
</template>

<script>
import workExtendedTable from '../PageElements/tables/workExtendedTable'
import { getWorksList } from '../../../main/dal.js'

export default {
  name: 'workslist',
  components: {
    workExtendedTable
  },
  data () {
    return {
      headers: [ {
          title: 'Nº',
          dataField: 'IdTrabajo',
          titleClass: '',
          rowClass: ''
        }, {
          title: 'Dentista',
          dataField: 'NombreDentista',
          titleClass: '',
          rowClass: ''
        }, {
          title: 'Paciente',
          dataField: 'Paciente',
          titleClass: '',
          rowClass: ''
        }, {
          title: 'Tipo',
          dataField: 'TipoTrabajo',
          titleClass: '',
          rowClass: ''
        }, {
          title: 'Color',
          dataField: 'Color',
          titleClass: '',
          rowClass: ''
        }, {
          title: 'F. Entrada',
          dataField: 'FechaEntrada',
          titleClass: '',
          rowClass: '',
          formatter: 'date'
        }, {
          title: 'F. Prevista',
          dataField: 'FechaPrevista',
          titleClass: '',
          rowClass: '',
          formatter: 'date'
        }, {
          title: 'F. Terminación',
          dataField: 'FechaTerminacion',
          titleClass: '',
          rowClass: '',
          formatter: 'date'
        }, {
          title: 'Importe',
          dataField: 'PrecioFinal',
          titleClass: '',
          rowClass: 'text-right',
          formatter: 'money'
        } ],
      searchFields: ['IdTrabajo', 'NombreDentista', 'Paciente', 'Color'],
      filterChanged: false,
      listHeading: ''
    }
  },
  methods: {
    translateFilter(filterName) {
      switch(filterName) {
        case 'receivedToday':
          return {fEntrada: 'Hoy'}
        case 'inProgress':
          return {fSalida: 'Ninguna o en el futuro'}
        case 'closedThisMonth':
          return {fSalida: 'Este mes'}
        case 'closedLast30days':
          return {fSalida: 'Últimos 30 días'}
      }
    },
    updateDatasetWithFilters (eventData) {
      getWorksList('labManager.sqlite', eventData).then((works) => {
        this.$children[0].setDataset(works)
      })
    },
    processFilterChange(filterData){
      this.updateDatasetWithFilters(filterData)
      this.filterChanged = true
    }
  },
  computed: {
    showCustomHeader: function() {
      return this.listHeading !== undefined && !this.filterChanged
    }
  },
  created () {
    this.listHeading = this.$route.query.title
  },
  mounted () {
    console.log('mounted')
    this.$refs.table.setFilters(this.$route.query.filter)
    this.updateDatasetWithFilters(this.translateFilter(this.$route.query.filter))

    this.$root.$on('workList:ReloadRequest', () => {
      console.log('reloaded')
      this.$refs.table.setFilters(this.$route.query.filter)
      this.updateDatasetWithFilters(this.translateFilter(this.$route.query.filter))
      this.filterChanged = false
      this.listHeading = this.$route.query.title
    })
  }
}

</script>
