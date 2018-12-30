<template>
  <div>
    <div class="container">
      <div class="row">
        <div class="col-md-6">
          <h1>Dentista</h1>
        </div> <!-- col-md-6 -->
        <div class="col-md-6 mt-2">
          <div class="float-right">
            <div>
              <collapsable-link-button iconCss="fa fa-fw fa-list" text="Ver sus trabajos" :pathTo="getWorkListUrl()"></collapsable-link-button>
            </div>
          </div>
        </div> <!-- col-md-6 -->
      </div><!-- row -->
      <div class="row">
        <div class="col-md-8">
          <div class="row">
            <div class="col-md-6 mt-3">
              <label for="dentista">Dentista</label>
              <input type="text" class="form-control" id="dentista" placeholder="Nombre de el/la dentista" v-model="data.NombreDentista">
            </div> <!-- col-md-6 -->
            <div class="col-md-6 mb-3 mt-3">
              <label for="clinica">Clínica</label>
              <input type="text" class="form-control" id="clinica" placeholder="Nombre de la clínica" v-model="data.NombreClinica" ref="inputClinica">
              <small class="form-text text-danger" v-if="requiresValidation && data.NombreClinica === ''" ref="clinicaValidator">El nombre de la clínica no puede estar en blanco</small>
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
              <label for="codigoPostal">C. Postal</label>
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
        <div class="col-md-4 separated-column text-left"> <!-- Columna 2 -->
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
import { getDentist, updateDentist } from '../../../main/dal.js'
import collapsableLinkButton from '../PageElements/CollapsableButtons/collapsableLinkButton'
export default {
  name: 'dentistDetail',
  components: {
    collapsableLinkButton
  },
  data () {
    return {
      dentistId: 0,
      requiresValidation: false,
      isDirty: false,
      data: {}
    }
  },
  methods: {
    getWorkListUrl : function() {
      return `/works/list/dentist/${this.dentistId}?title=Lista de Trabajos de ${this.data.NombreDentista}`
    },
    save: function() {
      this.requiresValidation = true

      if (this.canBeSaved) {
        updateDentist(this.data, 'labManager.sqlite')
      }
    },
    canBeSaved: function() {
      return this.isDirty && this.data.NombreClinica !== ''
    }
  },
  mounted () {
    this.dentistId = this.$route.params.id

    getDentist(this.dentistId, 'labManager.sqlite').then((dentistDetail) => {
      this.data = dentistDetail
    })
  }
}
</script>

<style>
.separated-column {
  border-left: 1px solid #CDC8CA;
}
</style>
