<template>
  <div class="container">
    <div class="row">
      <div class="col-md-6">
        <h1>Listado de dentistas</h1>
      </div>
      <div class="col-md-6 mt-2">
        <div class="float-right">
          <collapsable-button iconCss="fas fa-plus-circle" text="Nuevo dentista" pathTo="/dentists/new"></collapsable-button>
        </div>
      </div> <!-- col-md-6 -->
    </div> <!-- row -->
    <div>
      <myTable :headers="headers" :searchFields="searchFields" :eventId="eventId" ref="dentistTable" urlBase="/dentists/details/"/>
    </div>
  </div>

</template>

<script>
import myTable from '../PageElements/tables/myTable'
import { getDentistList } from '../../../main/dal.js'
import collapsableButton from '../PageElements/collapsableButton'

const EVENTID = 'DentistsList'

export default {
  name: 'dentistslist',
  components: {
    myTable,
    collapsableButton
  },
  data () {
    return {
      headers: [ {
          title: 'Nº',
          dataField: 'IdDentista',
          titleClass: 'invisible',
          rowClass: 'invisible'
        }, {
          title: 'Nombre',
          dataField: 'NombreDentista',
          titleClass: '',
          rowClass: ''
        }, {
          title: 'Clínica',
          dataField: 'NombreClinica',
          titleClass: '',
          rowClass: ''
        }, {
          title: 'Datos Fiscales',
          dataField: 'DatosFiscales',
          titleClass: '',
          rowClass: ''
        }, {
          title: 'Dirección',
          dataField: 'Direccion',
          titleClass: '',
          rowClass: ''
        }, {
          title: 'Poblacion',
          dataField: 'Poblacion',
          titleClass: '',
          rowClass: ''
        }, {
          title: 'Email',
          dataField: 'CorreoElectronico',
          titleClass: '',
          rowClass: 'emailColumn'
        }, {
          title: 'Tlf.',
          dataField: 'Telefono',
          titleClass: '',
          rowClass: ''
        }, {
          title: 'Tlf. 2',
          dataField: 'Telefono2',
          titleClass: '',
          rowClass: ''
        } ],
      searchFields: ['NombreDentista', 'NombreClinica', 'DatosFiscales', 'Direccion', 'Poblacion', 'CorreoElectronico', 'Telefono', 'Telefono2'],
      eventId: EVENTID
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
