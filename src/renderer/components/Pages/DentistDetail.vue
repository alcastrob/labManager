<template>
  <div>
    <div class="container">
      <div class="row">
        <div class="col-md-4">
          <h1>Dentista</h1>
        </div> <!-- col-md-6 -->
        <div class="col-md-8 mt-2">
          <div class="float-right">
            <div>
              <collapsible-link-button iconCss="fas fa-file-invoice-dollar mr-2" text="Ver sus facturas" :pathTo="getInvoiceListUrl()"></collapsible-link-button>
              <collapsible-link-button iconCss="fa fa-fw fa-list" text="Ver sus trabajos" :pathTo="getWorkListUrl()"></collapsible-link-button>
            </div>
          </div>
        </div> <!-- col-md-6 -->
      </div><!-- row -->
      <div class="row">
        <div class="col-md-8" :class="{'col-md-8': isAdmin, 'col-md-12': !isAdmin}">
          <div class="row">
            <div class="col-md-6 mt-3">
              <label for="dentista">Dentista</label>
              <input type="text" class="form-control" id="dentista" ref="dentista" placeholder="Nombre de el/la dentista" v-model="$v.data.NombreDentista.$model" :class="{'is-invalid': $v.data.NombreDentista.$error}">
              <small class="text-danger" v-if="$v.data.NombreDentista.$error">El nombre de el/la dentista no puede estar en blanco</small>
            </div> <!-- col-md-6 -->
            <div class="col-md-6 mb-3 mt-3">
              <label for="clinica">Clínica</label>
              <input type="text" class="form-control" id="clinica" placeholder="Nombre de la clínica" v-model="$v.data.NombreClinica.$model" ref="inputClinica">
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
              <textarea class="form-control" id="calle" placeholder="Calle, plaza, avenida..." rows="2" v-model="$v.data.Direccion.$model"></textarea>
            </div> <!-- col-md-6 -->
            <div class="col-md-2">
              <label for="codigoPostal">C. Postal</label>
              <input type="text" class="form-control" id="codigoPostal" placeholder="CP" v-model="$v.data.CP.$model" :class="{'is-invalid': $v.data.CP.$error}">
              <small class="text-danger" v-if="$v.data.CP.$error">Aunque opcional, se requiere que el código postal sea válido</small>
            </div> <!-- col-md-2 -->
            <div class="col-md-4">
              <label for="ciudad">Localidad</label>
              <input type="text" class="form-control" id="ciudad" placeholder="Ciudad" v-model="$v.data.Poblacion.$model">
            </div> <!-- col-md-4 -->
            <div class="col-md-6 mt-3">
              <label for="correoElectronico">Correo electrónico</label>
              <input type="text" class="form-control" id="correoElectronico" placeholder="xxx@yyy.zzz" v-model="$v.data.CorreoElectronico.$model" :class="{'is-invalid': $v.data.CorreoElectronico.$error}">
              <small class="text-danger" v-if="$v.data.CorreoElectronico.$error">Aunque opcional, se requiere que la dirección sea válida</small>
            </div> <!-- col-md-6 -->
            <div class="col-md-3 mt-3">
              <label for="telefono1">Teléfono 1</label>
              <input type="text" class="form-control" id="telefono1" placeholder="123 456 789" v-model="$v.data.Telefono.$model">
            </div> <!-- col-md-3 -->
            <div class="col-md-3 mt-3">
              <label for="telefono2">Teléfono 2</label>
              <input type="text" class="form-control" id="telefono2" placeholder="123 456 789" v-model="$v.data.Telefono2.$model">
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
              <input type="text" class="form-control" id="datosFiscales" placeholder="CIF / NIF" v-model="$v.data.DatosFiscales.$model">
            </div> <!-- col-md-4 -->
            <div class="col-md-4">
              <label for="datosBancarios">Datos bancarios</label>
              <input type="text" class="form-control" id="datosBancarios" placeholder="Número de cuenta" v-model="$v.data.DatosBancarios.$model">
            </div> <!-- col-md-4 -->
          </div>
          <div class="row mt-3">
            <div class="col-md-8">
              <h4>Otros datos de interés</h4>
            </div>
          </div> <!-- row -->
          <div class="row">
            <div class="col-md-12">
              <textarea class="form-control" id="datosInteres" rows="3" v-model="$v.data.DatosInteres.$model"></textarea>
              <br>
            </div>
          </div> <!-- row -->
          <div class="row">
            <div class="col-md-12 mt-3">
              <button class="btn btn-secondary btn-block" v-on:click="save()">
                <i class="fas fa-save"></i>
                Guardar
              </button>
            </div>
          </div> <!-- row -->
        </div>
        <div class="col-md-4 separated-column text-left" v-if="isAdmin"> <!-- Columna 2 -->
          <h4 class="pt-2">Datos y estadísticas</h4>
          <p class="text-left">Aquí irá toda la información de las estadísticas del dentista.</p>
          <p class="text-justify">Lorem, ipsum dolor sit amet consectetur adipisicing elit. Vero blanditiis impedit itaque perferendis magnam nesciunt iure deserunt? Perspiciatis nemo fugiat cum officiis et ratione in vel maxime. Ratione, hic consequuntur.</p>
          <p class="text-justify">Illo veritatis, eveniet laudantium expedita repudiandae error, pariatur et nobis laboriosam itaque neque ipsam iusto labore, dolorem suscipit provident tenetur! Ab accusantium totam autem cupiditate eveniet. Laboriosam consectetur repellendus debitis!</p>
          <p class="text-justify">Cumque nisi eum nam doloribus ea officia mollitia magni beatae adipisci non recusandae id consequuntur ullam sequi minima optio nesciunt omnis praesentium, soluta voluptatum, laborum enim, delectus quisquam. Soluta, laborum.</p>
          <p class="text-justify">Ullam, rerum in exercitationem, repudiandae sunt eligendi ab laboriosam ea facere, suscipit dolores voluptate nisi. Eos iure placeat dolores, cupiditate optio ex impedit explicabo accusantium doloribus iste nostrum neque! Quia.</p>
          </div>
      </div> <!-- row -->
    </div> <!-- container -->
  </div>
</template>

<script>
import { getDentist, updateDentist, getConfigValue } from '../../../main/dal.js'
import collapsibleLinkButton from '../PageElements/CollapsibleButtons/collapsibleLinkButton'
import { required, email, numeric, minLength, maxLength } from 'vuelidate/lib/validators'

export default {
  name: 'dentistDetail',
  components: {
    collapsibleLinkButton
  },
  data () {
    return {
      dentistId: 0,
      requiresValidation: false,
      // isDirty: false,
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
      },
      isAdmin: false
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
    getWorkListUrl : function() {
      return `/works/list/dentist/${this.dentistId}?title=Lista de Trabajos de ${this.data.NombreDentista}`
    },
    getInvoiceListUrl: function() {

      return `/finances?dentistName=${encodeURIComponent(this.data.NombreDentista)}`
    },
    save: function(url) {
      this.$v.data.$touch()
      if (this.$v.data.$anyError){
        if (this.$v.data.CorreoElectronico.$anyError){
          document.getElementById('correoElectronico').focus()
        }
        if (this.$v.data.CP.$anyError){
          document.getElementById('codigoPostal').focus()
        }
        if (this.$v.data.NombreDentista.$anyError){
          document.getElementById('dentista').focus()
        }
        return false
      } else {
        updateDentist(this.data)
        if (url === undefined || url === '') {
          this.$router.go(-1)
        } else {
          this.$router.push({
            path: url
          })
        }
      }
    },
    getConfig: async function() {
      this.isAdmin = await getConfigValue('isAdmin')
    }
  },
  created() {
    this.getConfig()
  },
  mounted () {
    this.dentistId = this.$route.params.id

    getDentist(this.dentistId).then((dentistDetail) => {
      this.data = dentistDetail
    })
    document.getElementById('dentista').focus()
    this.data.NombreDentista = this.$route.query.name
    this.$root.$on('topbar:save', this.save)
  },
  computed: {
    isDirty(){
      return this.$v.$anyDirty
    },
    isError(){
      return this.$v.$anyError
    }
  }
}
</script>

<style>
.separated-column {
  border-left: 1px solid #CDC8CA;
}
</style>
