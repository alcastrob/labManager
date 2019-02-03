<template>
  <div class="">
    <div class="row">
      <fileUploadBase class="col-md-12" type="image/*" :multipleFiles="true" ref="fileUpload"></fileUploadBase>
    </div> <!-- row -->
    <div class="row text-center text-lg-left">
      <div class="col-md-4 pb-3 text-center" v-for="image in value" v-bind:key="hash(image) + '-a-' + new Date().getTime()">
        <a href="#" class="mb-4" @click="viewImage(image)">
          <img class="img-fluid img-thumbnail thumbnail" :src="image" title="Haga click para visualizar">
        </a>
        <button class="btn btn-secondary btn-sm" title="Descargar la imagen al ordenador" @click="downloadImage(image)"><i class="fas fa-download"></i></button>
        <button class="btn btn-secondary btn-sm" title="Borrar la imagen" @click="deleteImage(image)"><i class="fas fa-times-circle"></i></button>
      </div> <!-- col-md-4 -->
    </div> <!-- row -->
    <div id="slider" ref="slider" class="carousel slide overlay" :class="{'displayNone': !fullscreen}" data-ride="carousel">
      <ol class="carousel-indicators" ref="imageIndicators">
        <li v-for="(image, idx) in value" v-bind:key="hash(image) + '-b-' + new Date().getTime()" data-target="#slider" :data-slice-to="value.indexOf(image)" :class="{ active: idx === 0 }"></li>
      </ol>
      <div class="carousel-inner" ref="carouselImages">
        <div class="carousel-item" v-for="(image, idx) in value" v-bind:key="hash(image) + '-c-' + new Date().getTime()">
          <img class="d-block img-fluid" :src="image">
        </div>
      </div>
      <a href="#slider" class="carousel-control-prev" data-slide="prev">
        <span class="carousel-control-prev-icon"></span>
      </a>
      <a href="#slider" class="carousel-control-next" data-slide="next">
          <span class="carousel-control-next-icon"></span>
        </a>
    </div>
  </div>

</template>

<script>
import fileUploadBase from './fileUploadBase'
import Vue from 'vue'
const dialog = require('electron').remote.dialog

document.onkeydown = e => {
  if (e === undefined) {
    bus.$emit('esc')
  } else {
    switch (e.keyCode) {
      case 27:
        bus.$emit('esc')
        break
      case 37:
        // bus.$emit('goPrev')
        break
      case 39:
        // bus.$emit('goNext')
        break
      default:
        console.log(e)
        break
    }
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
      fullscreen: false
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
        this.viewThubnails(file)
      }
    },
    viewImage(image) {
      this.fullscreen = true
      var position = this.value.indexOf(image)
      
      // for (var i = 0; i < this.value.length; i++){
      //   if (i === position) {
      //     this.$refs.carouselImages.childNodes[i].classList.add('active')
      //     // this.$refs.imageIndicators.childNodes[i].classList.add('active')
      //     console.log('active ' + i)
      //   } else {
      //     this.$refs.carouselImages.childNodes[i].classList.remove('active')
      //     // this.$refs.imageIndicators.childNodes[i].classList.remove('active')
      //     console.log('inactive ' + i)
      //   }
      // }
    },
    exitFullscreen() {
      this.fullscreen = false
    },
    viewThubnails(file){
      var reader = new FileReader()
      reader.onloadend = this.viewThubnails_sidecar
      reader.readAsDataURL(file)
    },
    viewThubnails_sidecar(e){
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
  },
  created() {
    bus
      .$on('goPrev', this.prev)
      .$on('goNext', this.next)
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
