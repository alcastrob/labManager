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
const fs = require('fs')
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
      var path = dialog.showSaveDialog(null, { defaultPath: 'logo.png'})
      if (path !== undefined) {
        var binaryArrays = this.convertFromBase64(this.value)
        var stream = fs.createWriteStream(path)
        for (var array of binaryArrays){
          stream.write(array)
        }
        stream.end()
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
    },
    convertFromBase64: function(b64) {
      var content = b64.replace(/data:image\/\w*;base64,/gm, '')
      var contentType = ''
      var sliceSize = 1024

      var byteCharacters = atob(content)
      var byteArrays = []

      for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        var slice = byteCharacters.slice(offset, offset + sliceSize)

        var byteNumbers = new Array(slice.length)
        for (var i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i)
        }

        var byteArray = new Uint8Array(byteNumbers)

        byteArrays.push(byteArray)
      }
      return byteArrays
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
