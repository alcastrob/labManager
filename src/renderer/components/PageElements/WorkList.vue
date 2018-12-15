<template>
<div class="card mb-3">
  <div class="card-header">
    <i class="fas fa-teeth"></i>
    Trabajos
  </div>
  <div class="card-body">
    <myTable></myTable>
  </div>
</div>
</template>

<script>
import { getWorksList } from '../../../main/dal.js'
import { myTable } from './table/myTable'

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
      currentSortCriteria: '',
      currentSortDesc: ''
    }
  },
  methods: {
    navigateToWork: function (idWork) {
      this.$parent.$parent.navigateTo('workDetail', idWork)
    },
    // Filter
    applyFilter: function (filter) {
      var lowercaseFilter = filter.toString().toLowerCase()
      if (filter !== '') {
        var a = _.filter(this.rawDataset, function(row){
          if (row.NombreDentista === null) return false
          return row.NombreDentista.toLowerCase().includes(lowercaseFilter)
        })
        var b = _.filter(this.rawDataset, function(row){
          if (row.Paciente === null) return false
          return row.Paciente.toString().toLowerCase().includes(lowercaseFilter)
        })
        var c = _.filter(this.rawDataset, function(row){
          if (row.IdTrabajo === null) return false
          return row.IdTrabajo.toString().toLowerCase().includes(lowercaseFilter)
        })
        var d = _.filter(this.rawDataset, function(row){
          if (row.Color === null) return false
          return row.Color.toString().toLowerCase().includes(lowercaseFilter)
        })
        this.filteredDataset = _.union(a, b, c, d, function(row) { return row.IdTrabajo})
        this.filteredDataset = _.sortBy(this.filteredDataset, function(row) { return row.IdTrabajo})
      } else {
        this.filteredDataset = this.rawDataset
      }
      this.currentPage = 1
    }
  },
  mounted () {
    getWorksList('labManager.sqlite').then((works) => {
        this.rawDataset = works
        this.filteredDataset = works
      })
    this.currentSortCriteria = 'IdTrabajo'
    this.currentSortDesc = true
  }
}
</script>
