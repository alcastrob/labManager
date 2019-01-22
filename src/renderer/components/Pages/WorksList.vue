<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-md-6">
        <h1 v-if="showCustomHeader">{{listHeading}}</h1>
        <h1 v-else>Listado de Trabajos</h1>
      </div> <!-- col-md-6 -->
      <div class="col-md-6 mt-2">
        <div class="float-right">
          <collapsibleExcelButton fileName="trabajos" :isCollapsible="true" :collapsed="false" :isDark="false" class="float-right mt-2" ref="excelButton"></collapsibleExcelButton>
        </div>
      </div> <!-- col-md-6 -->
    </div> <!-- row -->
    <div>
      <workExtendedTable :headers="headers" :searchFields="searchFields" ref="workExtendedTable" urlBase="/works/details/" masterKey="IdTrabajo" />
    </div>
  </div>
</template>

<script>
import { getWorksList } from '../../../main/dal.js'
import workExtendedTable from '../PageElements/tables/workExtendedTable'
import collapsibleExcelButton from '../PageElements/CollapsibleButtons/collapsibleExcelButton'

export default {
  name: 'worksList',
  components: {
    workExtendedTable,
    collapsibleExcelButton
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
    updateDatasetWithFilters: async function (eventData) {
      this.$refs.workExtendedTable.setDataset(await getWorksList(eventData))
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
    this.$refs.workExtendedTable.setFilters(this.$route.query.filter)
    this.updateDatasetWithFilters(this.translateFilter(this.$route.query.filter, this.$route.params.id))

    this.$root.$on('workList:ReloadRequest', () => {
      this.$refs.workExtendedTable.setFilters(this.$route.query.filter)
      this.updateDatasetWithFilters(this.translateFilter(this.$route.query.filter))
      this.filterChanged = false
      this.listHeading = this.$route.query.title
    })

    this.$refs.excelButton.setTable(this.$refs.workExtendedTable)
    // this.$refs.excelButton.setEnablePaginationCallback(this.$refs.workExtendedTable.enablePagination)
    // this.$refs.excelButton.setDisablePaginationCallback(this.$refs.workExtendedTable.disablePagination)
  }
}
</script>

