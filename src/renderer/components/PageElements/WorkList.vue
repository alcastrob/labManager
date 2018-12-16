<template>
<div class="card mb-3">
  <div class="card-header">
    <i class="fas fa-teeth"></i>
    Trabajos
  </div>
  <div class="card-body">
    <myTable :eventId="eventId" :headers="headers" :searchFields="searchFields" />
  </div>
</div>
</template>

<script>
import myTable from './table/myTable'
import { getWorksList } from '../../../main/dal.js'

const EVENTID = "WorksList"

export default {
  name: 'worklist',
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
      eventId: 'work'
    }
  },
  methods: {
    // navigateToWork: function (idWork) {
    //   this.$parent.$parent.navigateTo('workDetail', idWork)
    // }
  },
  mounted () {
    getWorksList('labManager.sqlite').then((works) => {
      this.$children[0].setDataset(works)
      })
    this.$root.$on('table:click:' + EVENTID, (key) => {
      this.$root.$emit('navigation:navigateTo', {page: 'workDetail', id: key, comeBack: EVENTID})
    })
  }
}
</script>
