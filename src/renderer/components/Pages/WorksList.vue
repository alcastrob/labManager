<template>
  <div class="container">
    <div class="row">
      <div class="col-md-6">
        <h1 v-if="this.listHeading === null">Listado de Trabajos</h1>
        <h1 v-else>{{listHeading}}</h1>
      </div>
    </div> <!-- row -->
    <div>
      <myTable :headers="headers" :searchFields="searchFields" :eventId="eventId" filterType="WorkFilterBar" :filterName="filter" ref="table"/>
    </div>
  </div>
</template>

<script>
import myTable from '../PageElements/table/myTable'
import { getWorksList } from '../../../main/dal.js'

const EVENTID = "WorksList"

export default {
  name: 'workslist',
  components: {
    myTable
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
      eventId: EVENTID
    }
  },
  props: {
    listHeading: {
      type: String,
      required: false
    },
    filter: {
      type: String,
      required: false
    }
  },
  methods: {
    updateDatasetWithFilters (eventData) {
      if (eventData === undefined) {
        switch(this.filter) {
          case 'receivedToday':
            eventData = {fEntrada: 'Hoy'}
            break
          case 'inProgress':
            eventData = {fSalida: 'Ninguna o en el futuro'}
            break;
          case 'closedThisMonth':
            eventData = {fSalida: 'Este mes'}
            break
          case 'closedLast30days':
            eventData = {fSalida: 'Últimos 30 días'}
            break
        }
      }

      getWorksList('labManager.sqlite', eventData).then((works) => {
        this.$children[0].setDataset(works)
      })
    }
  },
  mounted () {
    this.updateDatasetWithFilters()

    this.$root.$on('worksFilter:updated', this.updateDatasetWithFilters)

    //Table click event
    this.$root.$on('table:click:' + this.eventId, (eventData) => {
      this.$root.$emit('navigation:navigateTo', {page: 'workDetail', eventData: eventData, comeBack: this.eventId})
    })
  }
}
</script>
