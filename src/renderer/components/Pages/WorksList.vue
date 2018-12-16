<template>
  <div>
    <h1>Listado de Trabajos</h1>
    <div>
      <myTable :headers="headers" :searchFields="searchFields" :eventId="eventId" ref="table"/>
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
          rowClass: ''
        }, {
          title: 'F. Prevista',
          dataField: 'FechaPrevista',
          titleClass: '',
          rowClass: ''
        }, {
          title: 'F. Terminación',
          dataField: 'FechaSalida',
          titleClass: '',
          rowClass: ''
        }, {
          title: 'Importe',
          dataField: 'Precio',
          titleClass: '',
          rowClass: 'text-right'
        } ],
      searchFields: ['IdTrabajo', 'NombreDentista', 'Paciente', 'Color'],
      eventId: EVENTID
    }
  },
  methods: { },
  mounted () {
    getWorksList('labManager.sqlite').then((works) => {
      this.$children[0].setDataset(works)
      })
    this.$root.$on('table:click:' + EVENTID, (eventData) => {
      this.$root.$emit('navigation:navigateTo', {page: 'workDetail', eventData: eventData, comeBack: EVENTID})
    })
  }
}
</script>

<style>
</style>