<template>
<div>
  <h1>
    Listado de dentistas
  </h1>
  <div>
    <myTable :headers="headers" :searchFields="searchFields" :eventId="eventId"/>
  </div>
</div>
</template>

<script>
import myTable from '../PageElements/table/myTable'
import { getDentistList } from '../../../main/dal.js'

const EVENTID = 'DentistsList'

export default {
  name: 'dentistslist',
  components: {
    myTable
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
          title: 'Datos Bancarios',
          dataField: 'DatosBancarios',
          titleClass: '',
          rowClass: ''
        }, {
          title: 'Dirección',
          dataField: 'Direccion',
          titleClass: '',
          rowClass: ''
        }, {
          title: 'C. Postal',
          dataField: 'CP',
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
          rowClass: ''
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
        }, {
          title: 'Datos Interés',
          dataField: 'DatosInteres',
          titleClass: '',
          rowClass: ''
        } ],
      searchFields: ['NombreDentista', 'NombreClinica', 'DatosFiscales', 'DatosBancarios', 'Direccion', 'Poblacion', 'CP', 'CorreoElectronico', 'Telefono', 'Telefono2', 'DatosInteres'],
      eventId: EVENTID
    }
  },
  methods: {},
  mounted () {
    getDentistList('labManager.sqlite').then((dentists) => {
      this.$children[0].setDataset(dentists)
      })
    this.$root.$on('table:click:' + EVENTID, (eventData) => {
      this.$root.$emit('navigation:navigateTo', {page: 'dentistDetail', eventData: eventData, comeBack: EVENTID})
    })
  }
}
</script>

<style>
</style>
