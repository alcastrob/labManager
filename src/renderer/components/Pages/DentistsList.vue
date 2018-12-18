<template>
<div>
  <div class="container">
    <div class="row">
      <div class="col-md-6">
        <h1>Listado de dentistas</h1>
      </div>
      <div class="col-md-6 mt-2">
        <div class="float-right">
          <div>
            <collapsable-button iconCss="fas fa-plus-circle" text="Nuevo dentista" eventName="dentist:NewDentist"></collapsable-button>
          </div>
        </div>
      </div> <!-- col-md-6 mt-2 -->
    </div> <!-- row -->
    <div class="row">
      <div class="col-md-12">
        <myTable :headers="headers" :searchFields="searchFields" :eventId="eventId" ref="dentistTable"/>
      </div> <!-- col-md-12 -->
    </div> <!-- row -->
  </div> <!-- container -->
</div>
</template>

<script>
import myTable from '../PageElements/table/myTable'
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
      // this.$children[0].setDataset(dentists)
      this.$refs.dentistTable.setDataset(dentists)
    })
    this.$root.$on('table:click:' + EVENTID, (eventData) => {
      this.$root.$emit('navigation:navigateTo', {page: 'dentistDetail', eventData: eventData, comeBack: EVENTID})
    })
    this.$root.$on('dentist:NewDentist', () => {
      this.$root.$emit('navigation:navigateTo', {page: 'dentistNew'})
    })
  }
}
</script>

<style>
</style>
