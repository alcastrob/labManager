<template>
  <div>
    <fileUploadBase type="image/*" :multipleFiles="false" ref="fileUpload"></fileUploadBase>
    <div id="logo" class="carousel slide mb-2 center" data-ride="carousel">
      <div class="carousel-inner">
        <div class="carousel-item active">
          <img v-if="value.length > 0" class="d-block img-fluid" :src="value" alt="logo actual">
          <span v-else class="text-center">No hay ninguna imagen seleccionada</span>
        </div>
      </div>
    </div>
    <div class="text-center">
    <button class="btn btn-secondary" @click="download"><i class="fas fa-download mr-2 position-relative" style="top: 1px;"></i>Descargar a disco</button>
    <button class="btn btn-secondary" @click="deleteImage"><i class="fas fa-times-circle mr-2 position-relative" style="top: 1px;"></i>Borrar</button>

    </div>
  </div>
</template>

<script>
import fileUploadBase from './fileUploadBase'
const dialog = require('electron').remote.dialog

export default {
  name: 'logoFileUpload',
  components: {
    fileUploadBase
  },
  data () {
    return {}
  },
  props: {
    value: {}
  },
  methods: {
    deleteImage() {
      this.$emit('input', '')
    },
    download() {
      var imageType = this.$refs.fileUpload.getFileType(this.value)

      var path = dialog.showSaveDialog(null, { defaultPath: `logo.${imageType}`})
      if (path !== undefined) {
        this.$refs.fileUpload.saveFile(this.value, path)
      }
    },
    upload(file) {
      this.$refs.fileUpload.setStatusSaving()
      var reader = new FileReader()
      reader.onloadend = this.upload_sidecar
      reader.readAsDataURL(file[0])
    },
    upload_sidecar(e) {
      this.$emit('input', e.currentTarget.result)
      this.$refs.fileUpload.reset()
    }
  }
}
</script>

<style>
.center {
  display: block;
  margin: auto;
  width: 50%;
}
</style>
