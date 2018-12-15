<template>
<div class="card mb-3">
  <div class="card-header">
    <i class="fas fa-teeth"></i>
    Trabajos
  </div>
  <div class="card-body">
    <myTable :headers="headers" :rawDataset="rawDataset"/>
  </div>
</div>
</template>

<script>
import myTable from './table/myTable'
import { getWorksList } from '../../../main/dal.js'

export default {
  name: 'worklist',
  components: {
    myTable
  },
  data () {
    return {
      headers: [ {
          title: 'Nº trabajo',
          titleClass: '',
          rowClass: '',
          sortExpression: 'IdTrabajo'
        }, {
          title: 'Dentista',
          sortExpression: 'NombreDentista'
        }, {
          title: 'Paciente',
          sortExpression: 'Paciente'
        }, {
          title: 'Tipo',
          sortExpression: 'TipoTrabajo'
        }, {
          title: 'Color',
          sortExpression: 'Color'
        }, {
          title: 'F. Entrada',
          sortExpression: 'FechaEntrada'
        }, {
          title: 'F. Prevista',
          sortExpression: 'FechaPrevista'
        }, {
          title: 'F. Terminación',
          sortExpression: 'FechaSalida'
        }, {
          title: 'Importe',
          sortExpression: 'Precio'
        } ],
      rawDataset: []
    }
  },
  methods: {
    navigateToWork: function (idWork) {
      this.$parent.$parent.navigateTo('workDetail', idWork)
    },
  },
  mounted () {
    getWorksList('labManager.sqlite').then((works) => {
      this.rawDataset = works
    })
  }
}
</script>
