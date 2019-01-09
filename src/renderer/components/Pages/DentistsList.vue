<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-md-6">
        <h1>Listado de dentistas</h1>
      </div>
      <div class="col-md-6 mt-2">
        <div class="float-right">
          <collapsable-link-button iconCss="fas fa-plus-circle" text="Nuevo dentista" pathTo="/dentists/new"></collapsable-link-button>
        </div>
      </div> <!-- col-md-6 -->
    </div> <!-- row -->
    <div>
      <myTable :headers="headers" :searchFields="searchFields" ref="dentistTable"  urlBase="/dentists/details/" masterKey="IdDentista"/>
    </div> <!-- row -->
  </div>

</template>

<script>
import myTable from '../PageElements/tables/myTable'
import { getDentistList } from '../../../main/dal.js'
import collapsableLinkButton from '../PageElements/CollapsableButtons/collapsableLinkButton'

export default {
  name: 'dentistslist',
  components: {
    myTable,
    collapsableLinkButton
  },
  data () {
    return {
      headers: [
        {
          title: 'Nombre',
          dataField: 'NombreDentista',
          titleClass: 'text-left',
          rowClass: ''
        }, {
          title: 'Clínica',
          dataField: 'NombreClinica',
          titleClass: 'text-left',
          rowClass: ''
        }, {
          title: 'Dirección',
          dataField: 'Direccion',
          titleClass: 'text-left',
          rowClass: ''
        }, {
          title: 'Poblacion',
          dataField: 'Poblacion',
          titleClass: 'text-left',
          rowClass: ''
        }, {
          title: 'Email',
          dataField: 'CorreoElectronico',
          titleClass: 'text-left',
          rowClass: 'emailColumn'
        }, {
          title: 'Tlf.',
          dataField: 'Telefono',
          titleClass: 'text-left',
          rowClass: ''
        }, {
          title: 'Tlf. 2',
          dataField: 'Telefono2',
          titleClass: 'text-left',
          rowClass: ''
        }, {
          title: 'Primer trabajo',
          dataField: 'FechaPrimerTrabajo',
          titleClass: 'text-left',
          rowClass: '',
          formatter: 'date'
        },{
          title: 'Último trabajo',
          dataField: 'FechaUltimoTrabajo',
          titleClass: 'text-left',
          rowClass: '',
          formatter: 'date'
        }],
      searchFields: ['NombreDentista', 'NombreClinica', 'Direccion', 'Poblacion', 'CorreoElectronico', 'Telefono', 'Telefono2']
    }
  },
  methods: {},
  mounted () {
    getDentistList('labManager.sqlite').then((dentists) => {
      this.$refs.dentistTable.setDataset(dentists)
    })
  }
}
</script>

<style>
.emailColumn {
  max-width: 300px;
  word-break: break-all;
}
</style>
