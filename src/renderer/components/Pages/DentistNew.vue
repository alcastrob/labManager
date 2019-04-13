<template>
  <div>
    <div class="container">
      <div class="row">
        <div class="col-md-8">
          <h1>Nuevo Dentista</h1>
        </div>
      </div>
      <!-- row -->
      <div class="row">
        <div class="col-md-6 mt-3">
          <label for="dentista">Dentista</label>
          <input
            type="text"
            class="form-control"
            id="dentista"
            placeholder="Nombre de el/la dentista"
            :class="{'is-invalid': $v.data.NombreDentista.$error}"
            v-model="$v.data.NombreDentista.$model"
          >
          <small
            class="text-danger"
            v-if="$v.data.NombreDentista.$error"
          >El nombre de el/la dentista no puede estar en blanco</small>
        </div>
        <!-- col-md-6 -->
        <div class="col-md-6 mb-3 mt-3">
          <label for="clinica">Clínica</label>
          <input
            type="text"
            class="form-control"
            id="clinica"
            placeholder="Nombre de la clínica"
            v-model="$v.data.NombreClinica.$model"
          >
        </div>
        <!-- col-md-6 -->
      </div>
      <!-- row -->
      <div class="row">
        <div class="col-md-8">
          <h4>Dirección y contacto</h4>
        </div>
      </div>
      <!-- row -->
      <div class="row">
        <div class="col-md-6">
          <label for="calle">Calle</label>
          <textarea
            class="form-control"
            id="calle"
            placeholder="Calle, plaza, avenida..."
            rows="2"
            v-model="$v.data.Direccion.$model"
          ></textarea>
        </div>
        <!-- col-md-6 -->
        <div class="col-md-2">
          <label for="codigoPostal">Código Postal</label>
          <input
            type="text"
            class="form-control"
            id="codigoPostal"
            placeholder="CP"
            v-model="$v.data.CP.$model"
            :class="{'is-invalid': $v.data.CP.$error}"
          >
          <small
            class="text-danger"
            v-if="$v.data.CP.$error"
          >Aunque opcional, se requiere que el código postal sea válido</small>
        </div>
        <!-- col-md-2 -->
        <div class="col-md-4">
          <label for="ciudad">Localidad</label>
          <input
            type="text"
            class="form-control"
            id="ciudad"
            placeholder="Ciudad"
            v-model="$v.data.Poblacion.$model"
          >
        </div>
        <!-- col-md-4 -->
        <div class="col-md-6 mt-3">
          <label for="correoElectronico">Correo electrónico</label>
          <input
            type="text"
            class="form-control"
            id="correoElectronico"
            placeholder="xxx@yyy.zzz"
            v-model="$v.data.CorreoElectronico.$model"
            :class="{'is-invalid': $v.data.CorreoElectronico.$error}"
          >
          <small
            class="text-danger"
            v-if="$v.data.CorreoElectronico.$error"
          >Aunque opcional, se requiere que la dirección sea válida</small>
        </div>
        <!-- col-md-6 -->
        <div class="col-md-3 mt-3">
          <label for="telefono1">Teléfono 1</label>
          <input
            type="text"
            class="form-control"
            id="telefono1"
            placeholder="123 456 789"
            v-model="$v.data.Telefono.$model"
          >
        </div>
        <!-- col-md-3 -->
        <div class="col-md-3 mt-3">
          <label for="telefono2">Teléfono 2</label>
          <input
            type="text"
            class="form-control"
            id="telefono2"
            placeholder="123 456 789"
            v-model="$v.data.Telefono2.$model"
          >
        </div>
        <!-- col-md-3 -->
      </div>
      <!-- row -->

      <div class="row mt-3">
        <div class="col-md-8">
          <h4>Fiscal</h4>
        </div>
      </div>
      <!-- row -->
      <div class="row">
        <div class="col-md-4">
          <label for="datosFiscales">CIF/NIF</label>
          <input
            type="text"
            class="form-control"
            id="datosFiscales"
            placeholder="CIF / NIF"
            v-model="$v.data.DatosFiscales.$model"
          >
        </div>
        <!-- col-md-4 -->
        <div class="col-md-4">
          <label for="datosBancarios">Datos bancarios</label>
          <input
            type="text"
            class="form-control"
            id="datosBancarios"
            placeholder="Número de cuenta"
            v-model="$v.data.DatosBancarios.$model"
          >
        </div>
        <!-- col-md-4 -->
      </div>
      <div class="row mt-3">
        <div class="col-md-8">
          <h4>Otros datos de interés</h4>
        </div>
      </div>
      <!-- row -->
      <div class="row">
        <div class="col-md-12">
          <textarea
            class="form-control"
            id="datosInteres"
            rows="3"
            v-model="$v.data.DatosInteres.$model"
          ></textarea>
          <br>
        </div>
      </div>
      <!-- row -->
      <div class="row">
        <div class="col-md-12 mt-3">
          <button class="btn btn-secondary btn-block" v-on:click="save()">
            <i class="fas fa-save"></i>
            Guardar
          </button>
        </div>
      </div>
      <!-- row -->
    </div>
  </div>
</template>

<script>
import DentistService from '../../../services/DentistService'
import { required, email, numeric, minLength, maxLength } from 'vuelidate/lib/validators'
import log from 'loglevel'

export default {
	name: 'dentistDetail',
	data() {
		return {
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
	validations: {
		data: {
			IdDentista: {},
			NombreDentista: { required },
			NombreClinica: {},
			DatosFiscales: {},
			Direccion: {},
			DatosBancarios: {},
			DatosInteres: {},
			CorreoElectronico: { email },
			CP: { numeric, minLength: minLength(5), maxLength: maxLength(5) },
			Poblacion: {},
			Telefono: {},
			Telefono2: {}
		}
	},
	methods: {
		save: async function(url) {
			this.$v.data.$touch()
			if (this.$v.data.$anyError) {
				if (this.$v.data.CorreoElectronico.$anyError) {
					document.getElementById('correoElectronico').focus()
				}
				if (this.$v.data.CP.$anyError) {
					document.getElementById('codigoPostal').focus()
				}
				if (this.$v.data.NombreDentista.$anyError) {
					document.getElementById('dentista').focus()
				}
				return false
			}
			await this.dentistService.insertDentist(this.data)
			this.$v.$reset()
			if (!url) {
				log.info(`>> navigate: go(-1)`)
				this.$router.go(-1)
			} else {
				log.info(`>> navigate: ${url}`)
				this.$router.push({
					path: url
				})
			}
		}
	},
	computed: {
		isDirty() {
			return this.$v.$anyDirty
		},
		isError() {
			return this.$v.$anyError
		}
	},
	created() {
		this.dentistService = new DentistService()
	},
	mounted() {
		document.getElementById('dentista').focus()
		this.data.NombreDentista = this.$route.query.name
		this.$root.$on('topbar:save', this.save)
	}
}
</script>
