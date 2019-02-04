<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-md-12">
        <h1>Configuración de la aplicación</h1>
      </div> <!-- col-md-12 -->
    </div> <!-- row -->
    <div class="row">
      <div class="col-md-6 mt-3">
        <label for="companyName">Nombre de la empresa</label>
        <input type="text" class="form-control" v-model="$v.config.companyName.$model" id="companyName" ref="companyName" :class="{'is-invalid': $v.config.companyName.$error}">
        <small class="text-danger" v-if="$v.config.companyName.$error">Este valor es obligatorio<br></small>

        <label for="makerNumber" class="mt-2">Número de fabricante</label>
        <input type="text" class="form-control" v-model="$v.config.makerNumber.$model" id="makerNumber" ref="makerNumber" :class="{'is-invalid': $v.config.makerNumber.$error}">
        <small class="text-danger" v-if="$v.config.makerNumber.$error">Este valor es obligatorio<br></small>

        <label for="vatNumber" class="mt-2">CIF</label>
        <input type="text" class="form-control" v-model="$v.config.vatNumber.$model" id="vatNumber" ref="vatNumber" :class="{'is-invalid': $v.config.vatNumber.$error}">
        <small class="text-danger" v-if="$v.config.vatNumber.$error">Este valor es obligatorio<br></small>

        <label for="sharedPath" class="mt-2">Directorio de imágenes</label>
        <input type="text" class="form-control" v-model="$v.config.sharedPath.$model" id="sharedPath" ref="sharedPath" :class="{'is-invalid': $v.config.sharedPath.$error}">
        <small class="text-danger" v-if="$v.config.sharedPath.$error">Este valor es obligatorio<br></small>

      </div> <!-- col-md-6 -->

      <div class="col-md-6 mt-3">
        <label for="personInCharge" class="">Responsable</label>
        <input type="text" class="form-control" v-model="$v.config.personInCharge.$model" id="personInCharge" ref="personInCharge" :class="{'is-invalid': $v.config.personInCharge.$error}">
        <small class="text-danger" v-if="$v.config.personInCharge.$error">Este valor es obligatorio<br></small>

        <label for="invoiceFooter" class="mt-2">Pie de factura</label>
        <input type="text" class="form-control" v-model="$v.config.invoiceFooter.$model" id="invoiceFooter" ref="invoiceFooter" :class="{'is-invalid': $v.config.invoiceFooter.$error}">
        <small class="text-danger" v-if="$v.config.invoiceFooter.$error">Este valor es obligatorio<br></small>

        <label for="logo" class="mt-2">Logo</label>
         <!--UPLOAD-->
        <logoFileUpload v-model="$v.config.logo.$model" :class="{'is-image-invalid': $v.config.logo.$error}"></logoFileUpload>

        <!-- <input type="text" class="form-control" v-model="$v.config.logo.$model" id="personInCharge" :class="{'is-invalid': $v.config.personInCharge.$error}"> -->
        <small class="text-danger" v-if="$v.config.logo.$error">Este valor es obligatorio<br></small>
      </div> <!-- col-md-6 -->
    </div> <!-- row -->
  </div>
</template>

<script>
// import { mixin as clickaway } from 'vue-clickaway'
import { required } from 'vuelidate/lib/validators'
import { getConfigValues, setConfigValue } from '../../../main/dal.js'
const fs = require('fs')
import logoFileUpload from '../PageElements/fileUploads/logoFileUpload'

export default {
  name: 'configuration',
  components: {
    logoFileUpload
  },
  data () {
    return {
      config: {
        companyName: '',
        makerNumber: '',
        vatNumber: '',
        personInCharge: '',
        logo: '',
        invoiceFooter: '',
        sharedPath: ''
      }
    }
  },
  validations: {
    config: {
      companyName: { required },
      makerNumber: { required },
      vatNumber: { required },
      personInCharge: { required },
      logo: { required },
      invoiceFooter: { required },
      sharedPath: { required }
    }
  },
  methods: {
    save: async function(url){
      if (this.$v.$anyError){
        if (this.$v.config.invoiceFooter.$anyError){
          this.$refs.invoiceFooter.focus()
        }
        if (this.$v.config.vatNumber.$anyError){
          this.$refs.vatNumber.focus()
        }
        if (this.$v.config.logo.$anyError){
          this.$refs.logo.focus()
        }
        if (this.$v.config.makerNumber.$anyError){
          this.$refs.makerNumber.focus()
        }
        if (this.$v.config.personInCharge.$anyError){
          this.$refs.personInCharge.focus()
        }
        if (this.$v.config.companyName.$anyError){
          this.$refs.companyName.focus()
        }
        if (this.$v.config.sharedPath.$anyError){
          this.$refs.sharedPath.focus()
        }

        return false
      }

      if (this.$v.config.companyName.$dirty){
        await setConfigValue('companyName', this.config.companyName)
      }
      if (this.$v.config.personInCharge.$dirty){
        await setConfigValue('personInCharge', this.config.personInCharge)
      }
      if (this.$v.config.makerNumber.$dirty){
        await setConfigValue('makerNumber', this.config.makerNumber)
      }
      if (this.$v.config.logo.$dirty){
        await setConfigValue('logo', this.config.logo)
      }
      if (this.$v.config.vatNumber.$dirty){
        await setConfigValue('vatNumber', this.config.vatNumber)
      }
      if (this.$v.config.invoiceFooter.$dirty){
        await setConfigValue('invoiceFooter', this.config.invoiceFooter)
      }
      if (this.$v.config.sharedPath.$dirty){
        await setConfigValue('sharedPath', this.config.sharedPath)
      }

      this.$router.push({ path: url })
    },
    getData: async function(){
      for (var pair of await getConfigValues()) {
        this.config[pair.clave] = pair.valor
      }
    }
  },
  computed: {
    isDirty(){
      return false
    },
    isError(){
      var result = this.$v.$anyError
      if (this.$refs.workIndications !== undefined){
        result = result
      }
      return result
    }
  },
  created () {
    this.$on('topbar:save', this.save)
    this.getData()
  }
}
</script>
<style>
.is-image-invalid {
  background-color: #FF7285;
  padding: 10px;
  border: 1px solid red;
}
</style>