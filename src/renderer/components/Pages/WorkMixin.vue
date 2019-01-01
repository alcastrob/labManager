<template>
</template>

<script>
import Vue from 'Vue'
import workIndicationsTable from '../PageElements/WorkIndicationsTable'
import workTestsTable from '../PageElements/workTestsTable'
import collapsableActionButton from '../PageElements/CollapsableButtons/collapsableActionButton'
import dentistSearch from '../PageElements/DentistSearch'
import workAdjuncts from '../PageElements/WorkAdjuncts'
import labelEsqueleticos from '../Labels/LabelEsqueleticos'
import labelCompostura from '../Labels/labelCompostura'
import labelResina from '../Labels/LabelResina'
import labelAditamentos from '../Labels/labelAditamentos'
import labelComposite from '../Labels/labelComposite'
import bModal from 'bootstrap-vue'
import _ from 'lodash'
import { getWorkTypes } from '../../../main/dal.js'

export default {
  components: {
    workIndicationsTable,
    workTestsTable,
    collapsableActionButton,
    workAdjuncts,
    dentistSearch
  },
  data () {
    return {
      //It's necessary to use a boolean var instead of the isDirty bacause the form has a field with the focus that automatically touches the validator.
      saveButtonPressed: false,

      work: {
        IdTrabajo: 0,
        IdDentista: 0,
        NombreDentista: '',
        IdTipoTrabajo: 0,
        Paciente: '',
        Color: '',
        PrecioMetal: 0,
        FechaEntrada: '',
        FechaPrevista: '',
        FechaTerminacion: ''
      },
      workTypes: {},
      workIndications: [],
      workIndicationsText: '',
      workAdjuncts: {
        IdTrabajo: 0,
        Caja: '',
        Cubeta: '',
        Articulador: '',
        Pletinas: '',
        Tornillos: '',
        Analogos: '',
        PosteImpresion: '',
        Interface: '',
        Otros: ''
      },
      adjunctsVisible: false,
      workAdjunctsJustAdded: false
    }
  },
  methods: {
    hideModal() {
      this.$refs.modal.hide()
    },
    printLabel: function() {
      var ComponentClass = this.mapType(this.printedLabel)
      var instance = new ComponentClass({
          propsData: {
            workData: this.work,
            workIndicationsText: this.workIndicationsText,
            workAdjuncts: this.workAdjuncts
            }
      })
      instance.$mount()
      this.$refs.labelContainer.appendChild(instance.$el)
      instance.setName(this.printedLabel)
      instance.print(this.printedLabel)
      this.$refs.labelContainer.removeChild(instance.$el)
    },
    mapType(type) {
      switch(type) {
        case 'Aditamentos':
          return Vue.extend(labelAditamentos)
        case 'Composite':
        case 'E-Max':
        case 'Implantes':
        case 'Metal-Cerámica':
        case 'Zirconio':
          return Vue.extend(labelComposite)
        case 'Esqueléticos':
          return Vue.extend(labelEsqueleticos)
        case 'Compostura':
        case 'Ortodoncia':
          return Vue.extend(labelCompostura)
        case 'Resina':
          return Vue.extend(labelResina)
        case 'Garantia':
          return Vue.extend(labelGarantia)
        default:
          throw 'Unexpected label type in WorkDetail.printLabel()'
      }
    },
    setStartDateToToday: function() {
      var today = new Date()
      var dd = today.getDate()

      var mm = today.getMonth()+1
      var yyyy = today.getFullYear()
      if(dd<10) {
          dd='0'+dd;
      }

      if(mm<10) {
          mm='0'+mm;
      }

      this.work.FechaEntrada = yyyy + '-' + mm + '-' + dd
    },
    showAdjunts: function(justAdded) {
      this.adjunctsVisible = true
      if (justAdded === undefined) {
        this.workAdjunctsJustAdded = true
      } else {
        this.workAdjunctsJustAdded = justAdded
      }
    }
  },
  mounted () {
    getWorkTypes('labManager.sqlite').then((types) => {
      this.workTypes = types
    })
  }
}
</script>
