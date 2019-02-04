<template>
  <div class="">
    <div class="row">
      <fileUploadBase class="col-md-12" type="image/*" :multipleFiles="true" ref="fileUpload"></fileUploadBase>
    </div> <!-- row -->
    <div class="row text-center text-lg-left">
      <div class="col-md-4 pb-3 text-center" v-for="(image, idx) in value" v-bind:key="idx">
        <a href="#" class="mb-4" @click="viewImage(image)">
          <img class="img-fluid img-thumbnail thumbnail" :src="image" title="Haga click para visualizar">
        </a>
        <button class="btn btn-secondary btn-sm" title="Descargar la imagen al ordenador" @click="downloadImage(image)"><i class="fas fa-download"></i></button>
        <button class="btn btn-secondary btn-sm" title="Borrar la imagen" @click="deleteImage(image, idx)"><i class="fas fa-times-circle"></i></button>
      </div> <!-- col-md-4 -->
    </div> <!-- row -->
    <b-carousel id="carousel1" ref="carousel1" controls indicators background="#ababab" :interval="0" v-model="currentSlide" class="overlay" :class="{'displayNone': !fullscreen}">
      <b-carousel-slide v-for="(image, idx) in value" :img-src="value[idx]" v-bind:key="'b-' + idx" @clidk="exitFullscreen">
      </b-carousel-slide>
    </b-carousel>
  </div>

</template>

<script>
import fileUploadBase from './fileUploadBase'
import Vue from 'vue'
const dialog = require('electron').remote.dialog
import bCarousel from 'bootstrap-vue'
import { copyFile, deleteFile, getFileList, getFileType, saveFile, turnFileIntoB64, hash } from '../../../../main/files.js'

document.onkeydown = e => {
  switch (e.keyCode) {
    case 27:
      bus.$emit('esc')
      break
    case 37:
      bus.$emit('goPrev')
      break
    case 39:
      bus.$emit('goNext')
      break
    default:
      break
  }
}

const bus = new Vue()

export default {
  name: 'imagesFileUpload',
  components: {
    fileUploadBase
  },
  data () {
    return {
      fullscreen: false,
      currentSlide: 0
    }
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
    deleteImage: async function(image, imagePosition) {
      debugger
      this.value.splice(imagePosition, 1)
      await deleteFile(image, this.idTrabajo)
      this.$emit('input', this.value)
    },
    downloadImage(image) {
      var position = this.value.indexOf(image)
      var imageType = getFileType(image)
      var path = dialog.showSaveDialog(null, {
        defaultPath: `${this.idTrabajo}_${position}.${imageType}`
        })
      if (path !== undefined) {
        saveFile(image, path)
      }
    },
    upload: async function(files){
      for (var file of files){
        debugger
        //First, insert the files into the shared directory
        var hash = hash(file)
        var path = await copyFile(file, hash, this.idTrabajo)

        //Then, update the UI
        this.viewThumbnail(file)
      }
    },
    viewImage(image) {
      this.fullscreen = true
      this.currentSlide = this.value.indexOf(image)
    },
    exitFullscreen() {
      this.fullscreen = false
    },
    goNext() {
      this.currentSlide = this.currentSlide % this.value.lenght
    },
    goPrev() {
      this.currentSlide = this.currentSlide % this.value.lenght
    },
    viewThumbnail(file){
      var reader = new FileReader()
      reader.onloadend = this.viewThumbnail_sidecar
      reader.readAsDataURL(file)
    },
    viewThumbnail_sidecar(e){
      this.value.push(e.currentTarget.result)
    },
    directViewThumbnail(file) {
      this.value.push(file)
    },
    getData: async function(){
      var files = await getFileList(this.idTrabajo)
      for (var file of files) {
        var x = await turnFileIntoB64(file)
        this.viewThumbnail(x)
      }
    }
  },
  mounted() {
    this.getData()
  },
  created() {
    bus
      .$on('goPrev', this.goPrev)
      .$on('goNext', this.goNext)
      .$on('esc', this.exitFullscreen)
  }
}
</script>

<style>
img.thumbnail {
  max-width: 100px;
  max-height: 200px;
}

.overlay {
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  background: rgba(51,51,51,0.7);
  z-index: 100;
  }
</style>
