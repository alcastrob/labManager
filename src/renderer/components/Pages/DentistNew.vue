<template>
  <div>
    <div class="container">
      <div class="row">
        <div class="col-md-8">
          <h1>Nuevo Dentista</h1>
        </div>
      </div> <!-- row -->
      <div class="row">
        <div class="col-md-6 mb-3 mt-3">
          <label for="clinica">Clínica</label>
          <input type="text" class="form-control" id="clinica" placeholder="Nombre de la clínica" v-model="data.NombreClinica" ref="elementToFocus">
        </div> <!-- col-md-6 -->
        <div class="col-md-6 mt-3">
          <label for="dentista">Dentista</label>
          <input type="text" class="form-control" id="dentista" placeholder="Nombre de el/la dentista" v-model="data.NombreDentista">
          <small class="form-text text-danger" v-if="initialValidation && (data.NombreDentista === '' || data.NombreDentista === null || data.NombreDentista === undefinded)">El nombre de el/la dentista no puede estar en blanco</small>
        </div> <!-- col-md-6 -->
      </div> <!-- row -->
      <div class="row">
        <div class="col-md-8">
          <h4>Dirección y contacto</h4>
        </div>
      </div> <!-- row -->
      <div class="row">
        <div class="col-md-6">
          <label for="calle">Calle</label>
          <textarea class="form-control" id="calle" placeholder="Calle, plaza, avenida..." rows="2" v-model="data.Direccion"></textarea>
        </div> <!-- col-md-6 -->
        <div class="col-md-2">
          <label for="codigoPostal">Código Postal</label>
          <input type="text" class="form-control" id="codigoPostal" placeholder="CP" v-model="data.CP">
        </div> <!-- col-md-2 -->
        <div class="col-md-4">
          <label for="ciudad">Localidad</label>
          <input type="text" class="form-control" id="ciudad" placeholder="Ciudad" v-model="data.Poblacion">
        </div> <!-- col-md-4 -->
        <div class="col-md-6 mt-3">
          <label for="correoElectronico">Correo electrónico</label>
          <input type="text" class="form-control" id="correoElectronico" placeholder="xxx@yyy.zzz" v-model="data.CorreoElectronico">
        </div> <!-- col-md-6 -->
        <div class="col-md-3 mt-3">
          <label for="telefono1">Teléfono 1</label>
          <input type="text" class="form-control" id="telefono1" placeholder="123 456 789" v-model="data.Telefono">
        </div> <!-- col-md-3 -->
        <div class="col-md-3 mt-3">
          <label for="telefono2">Teléfono 2</label>
          <input type="text" class="form-control" id="telefono2" placeholder="123 456 789" v-model="data.Telefono2">
        </div> <!-- col-md-3 -->
      </div> <!-- row -->

      <div class="row mt-3">
        <div class="col-md-8">
          <h4>Fiscal</h4>
        </div>
      </div> <!-- row -->
      <div class="row">
        <div class="col-md-4">
          <label for="datosFiscales">CIF/NIF</label>
          <input type="text" class="form-control" id="datosFiscales" placeholder="CIF / NIF" v-model="data.DatosFiscales">
        </div> <!-- col-md-4 -->
        <div class="col-md-4">
          <label for="datosBancarios">Datos bancarios</label>
          <input type="text" class="form-control" id="datosBancarios" placeholder="Número de cuenta" v-model="data.DatosBancarios">
        </div> <!-- col-md-4 -->
      </div>
      <div class="row mt-3">
        <div class="col-md-8">
          <h4>Otros datos de interés</h4>
        </div>
      </div> <!-- row -->
      <div class="row">
        <div class="col-md-12">
          <textarea class="form-control" id="datosInteres" rows="3" v-model="data.DatosInteres"></textarea>
          <br>
        </div>
      </div> <!-- row -->
      <div class="row">
        <div class="col-md-12 mt-3">
          <button class="btn btn-info 
          btn-block" v-on:click="save()" v-bind:class="{disabled: !canBeSaved()}">Guardar</button>
        </div>
      </div> <!-- row -->
    </div>
  </div>
</template>

<script>
import { insertDentist } from '../../../main/dal.js'

export default {
  name: 'dentistDetail',
  data () {
    return {
      initialValidation: false,
      data: {
        IdDentista: '',
        NombreDentista: '',
        NombreClinica: '',
        DatosFiscales: '',
        Direccion: '',
        DatosBancarios: '',
        DatosInteres: '',
        CorreoElectronico: '',
        CP: '',
        Poblacion: '',
        Telefono: '',
        Telefono2: ''
      }
    }
  },
  props: {
    dentistName: {
      type: String,
      required: false
    }
  },
  methods: {
    save: function() {
      // this.$notify({
      //   type: 'warn',
      //   title: 'Important message',
      //   text: 'Hello user! This is a notification!'
      // });
      // console.log('notify')
      this.initialValidation = true
      if (this.canBeSaved()) {
        // insertDentist(this.data, 'labManager.sqlite')
        console.log('saved')
      }
    },
    canBeSaved: function() {
      // debugger
      if (!this.initialValidation) {
        return true
      } else {
        return !(this.data.NombreDentista === '' || this.data.NombreDentista === null || this.data.NombreDentista === undefined)
      }
    }
  },
  mounted () {
    this.$refs.elementToFocus.focus()
    this.data.NombreDentista = this.dentistName
  }
}
</script>

<style>
</style>
