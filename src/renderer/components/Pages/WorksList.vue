<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-md-12">
        <h1 v-if="showCustomHeader">{{listHeading}}</h1>
        <h1 v-else>Listado de Trabajos</h1>
      </div>
    </div> <!-- row -->
    <div>
      <workExtendedTable :headers="headers" :searchFields="searchFields" ref="table" urlBase="/works/details/" masterKey="IdTrabajo" />
    </div>
  </div>
</template>

<script>
import { getWorksList } from '../../../main/dal.js'
import workExtendedTable from '../PageElements/tables/workExtendedTable'

export default {
  name: 'worksList',
  components: {
    workExtendedTable
  },
  data () {
    return {
      headers: [ {
          title: 'Nº',
          dataField: 'IdTrabajo',
          titleClass: 'text-left',
          rowClass: ''
        }, {
          title: 'Dentista',
          dataField: 'NombreDentista',
          titleClass: 'text-left',
          rowClass: ''
        }, {
          title: 'Paciente',
          dataField: 'Paciente',
          titleClass: 'text-left',
          rowClass: ''
        }, {
          title: 'Tipo',
          dataField: 'TipoTrabajo',
          titleClass: 'text-left',
          rowClass: ''
        }, {
          title: 'Color',
          dataField: 'Color',
          titleClass: 'text-left',
          rowClass: ''
        }, {
          title: 'F. Entrada',
          dataField: 'FechaEntrada',
          titleClass: 'text-left',
          rowClass: '',
          formatter: 'date'
        }, {
          title: 'F. Prevista',
          dataField: 'FechaPrevista',
          titleClass: 'text-left',
          rowClass: '',
          formatter: 'date'
        }, {
          title: 'F. Terminación',
          dataField: 'FechaTerminacion',
          titleClass: 'text-left',
          rowClass: '',
          formatter: 'date'
        }, {
          title: 'Importe',
          dataField: 'PrecioFinal',
          titleClass: 'text-right mr-2',
          rowClass: 'text-right',
          formatter: 'money'
        } ],
      searchFields: ['IdTrabajo', 'NombreDentista', 'Paciente', 'Color'],
      filterChanged: false,
      listHeading: ''
    }
  },
  methods: {
    translateFilter(filterName, idDentist) {
      if (idDentist === undefined){
        //It's a listing that includes ALL the dentist
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
      } else {
        // The listing is specific for one dentist
          return {IdDentista: idDentist}
      }
    },
    updateDatasetWithFilters (eventData) {
      getWorksList(eventData).then((works) => {
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
    this.$refs.table.setFilters(this.$route.query.filter)
    this.updateDatasetWithFilters(this.translateFilter(this.$route.query.filter, this.$route.params.id))

    this.$root.$on('workList:ReloadRequest', () => {
      this.$refs.table.setFilters(this.$route.query.filter)
      this.updateDatasetWithFilters(this.translateFilter(this.$route.query.filter))
      this.filterChanged = false
      this.listHeading = this.$route.query.title
    })
  }
}
</script>

