<template>
  <div class="">
    <div class="row">
      <fileUploadBase class="col-md-12" type="image/*" :multipleFiles="true" ref="fileUpload"></fileUploadBase>
    </div> <!-- row -->
    <div class="row text-center text-lg-left">
      <div class="col-md-4 pb-3 text-center" v-for="(image, idx) in imageArray" v-bind:key="image.path">
        <a href="#" class="mb-4" @click="viewImage(image.content, idx)">
          <img class="img-fluid img-thumbnail thumbnail" :src="image.content" title="Haga click para visualizar">
        </a>
        <button class="btn btn-secondary btn-sm" title="Descargar la imagen al ordenador" @click="downloadImage(image)"><i class="fas fa-download"></i></button>
        <button class="btn btn-secondary btn-sm" title="Borrar la imagen" @click="deleteImage(image)"><i class="fas fa-times-circle"></i></button>
      </div> <!-- col-md-4 -->
    </div> <!-- row -->
    <b-carousel id="carousel1" ref="carousel1" controls indicators background="#ababab" :interval="0" v-model="currentSlide" class="overlay" :class="{'displayNone': !fullscreen}">
      <b-carousel-slide v-for="(image, idx) in imageArray" :img-src="imageArray[idx].content" v-bind:key="'b-' + idx" @clidk="exitFullscreen">
      </b-carousel-slide>
    </b-carousel>
  </div>

</template>

<script>
import fileUploadBase from './fileUploadBase'
import Vue from 'vue'
const dialog = require('electron').remote.dialog
import bCarousel from 'bootstrap-vue'
import { copyFile, deleteFile, getFileList, saveFile, turnFileIntoB64 } from '../../../../main/files.js'
import _ from 'lodash'

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
      currentSlide: 0,
      imageArray: []
    }
  },
  props: {
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
    deleteImage: async function(image) {
      debugger
      _.remove(this.imageArray, (e) => { return e.path === image.path})
      await deleteFile(image)
      this.$forceUpdate()
    },
    downloadImage(image) {
      var path = dialog.showSaveDialog(null, {
        defaultPath: image.path.replace(/^.*[\\\/]/, '')
        })
      if (path !== undefined) {
        saveFile(image, path)
      }
    },
    upload: async function(files){
      for (var file of files){
        //First, insert the files into the shared directory
        var newPath = await copyFile(file, this.idTrabajo)

        //Then, update the UI
        this.viewThumbnail(file, newPath)
      }
    },
    viewImage(image, index) {
      this.fullscreen = true
      this.currentSlide = index
    },
    exitFullscreen() {
      this.fullscreen = false
    },
    goNext() {
      this.currentSlide = this.currentSlide % imageArray.lenght
    },
    goPrev() {
      this.currentSlide = this.currentSlide % imageArray.lenght
    },
    viewThumbnail(file, newPath){
      var reader = new FileReader()
      var parent = this
      reader.onloadend = function(e) {
        if (newPath !== undefined) {
          //If this function is called from upload, file will have a field called name that will point to the local directory (before upload). In this case, newFile will be set.
          parent.imageArray.push({path: newPath, content: e.currentTarget.result})
        } else {
          //If this function is called from getData, newPath will be undefined, and the name field on file will contain the full path to the server file (after upload).
          parent.imageArray.push({path: file.name, content: e.currentTarget.result})
        }
      }
      reader.readAsDataURL(file)
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
