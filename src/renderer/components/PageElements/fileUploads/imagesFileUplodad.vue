<template>
  <div class="">
    <div class="row">
      <fileUploadBase class="col-md-12" type="image/*" :multipleFiles="true" ref="fileUpload"></fileUploadBase>
    </div> <!-- row -->
    <div class="row text-center text-lg-left">
      <div class="col-md-4 pb-3 text-center" v-for="image in value" v-bind:key="hash(image) + '-' + new Date().getTime()">
        <a href="#" class="mb-4">
          <img class="img-fluid img-thumbnail thumbnail" :src="image" title="Haga click para visualizar">
        </a>
        <button class="btn btn-secondary btn-sm" title="Descargar la imagen al ordenador" @click="downloadImage(image)"><i class="fas fa-download"></i></button>
        <button class="btn btn-secondary btn-sm" title="Borrar la imagen" @click="deleteImage(image)"><i class="fas fa-times-circle"></i></button>
      </div> <!-- col-md-4 -->
    </div> <!-- row -->
  </div> <!-- container -->
</template>

<script>
import fileUploadBase from './fileUploadBase'
const dialog = require('electron').remote.dialog

export default {
  name: 'imagesFileUpload',
  components: {
    fileUploadBase
  },
  data () {
    return {}
  },
  props: {
    value: {
    },
    accept: {
      type: String,
      required: false,
      default: '*'
    },
    multipleFiles: {
      type: Boolean,
      required: false,
      default: 'true'
    },
    idTrabajo: {
      type: Number,
      required: true
    }
  },
  methods: {
    deleteImage(image) {
      this.value.splice(this.value.indexOf(image), 1)
      this.$emit('input', this.value)
    },
    downloadImage(image) {
      var position = this.value.indexOf(image)
      var imageType = this.$refs.fileUpload.getFileType(image)
      var path = dialog.showSaveDialog(null, {
        defaultPath: `${this.idTrabajo}_${position}.${imageType}`
        })
      if (path !== undefined) {
        this.$refs.fileUpload.saveFile(image, path)
      }
    },
    upload(files){
      for (var file of files){
        this.viewFile(file)
      }
    },
    viewFile(file){
      var reader = new FileReader()
      reader.onloadend = this.viewFile_sidecar
      reader.readAsDataURL(file)
    },
    viewFile_sidecar(e){
      this.value.push(e.currentTarget.result)
    },
    hash: function(data) {
      var hash = 0, i, chr
      if (data.length === 0) return hash
      for (i = 0; i < data.length; i++) {
        chr   = data.charCodeAt(i)
        hash  = ((hash << 5) - hash) + chr
        hash |= 0 // Convert to 32bit integer
      }
      return hash
    }
  }
}
</script>

<style>
img.thumbnail {
  max-width: 100px;
  max-height: 200px;
}
</style>
