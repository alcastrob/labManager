<template>
<div>
    <h1>Acerca de labManager</h1>
    <h3>versión {{currentVersion}}</h3>
    <p class="text-left">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis voluptate reiciendis asperiores atque quod animi ducimus, aliquam voluptatem esse labore doloremque facilis nesciunt quia deserunt, repellat laboriosam accusantium velit veritatis.</p>
    <div class="alert alert-success animated bounceInDown" v-if="newerVersion">
      <!-- alert-dismissible  -->
      <!-- <button class="close" type="button" data-dismiss="alert">
        <span>x</span>
      </button> -->
      <h4 class="alert-heading">Nueva versión del programa disponible ({{latestVersion}})</h4>
      <hr>
      <h5>{{latestVersionTitle}}</h5>
      <div v-html="latestVersionDescription"></div>
      <div align="right">
        <button class="btn btn-secondary mt-4" v-on:click="download" v-if="!downloading">
          <i class="fas fa-cloud-download-alt"></i>
          Descargar e instalar
        </button>
        <div class="progress mt-4 mb-4" v-else>
          <div class="progress-bar bg-info progress-bar-striped progress-bar-animated" :style="downloadedPercentage"></div>
        </div>

      </div>
    </div>
    <p class="text-left">Los elementos externos que han sido licenciados para esta aplicación son:
    <ul>
        <li>
          Icono de la aplicación diseñado por BanzaiTokyo.
          <br>
          https://www.iconspedia.com/icon/tooth-icon-29053.html
          <br>
          Licencia CC Attribution
        </li>
        <li>
          Plantilla HTML diseñada por Start Bootstrap
          <br>
          https://startbootstrap.com/template-overviews/sb-admin/
          <br>
          Licencia MIT
        </li>
    </ul>
    </p>
</div>
</template>

<script>
import { checkForUpdates, downloadUpdate } from '../../../main/updates.js'

export default {
  name: 'about',
  data () {
    return {
      currentVersion: '',
      newerVersion: false,
      latestVersion: '',
      latestVersionTitle: '',
      latestVersionDescription: '',
      downloadUrl: '',
      installName: '',
      downloading: false,
      downloadedPercentage: ''
    }
  },
  methods: {
    download: async function() {
      this.downloading = true
      downloadUpdate(this.downloadUrl, this.installName, this.updatedPercentageCallback)
    },
    checkForUpdates: async function() {
      var updateInfo = await checkForUpdates()
      this.downloadUrl = updateInfo.downloadUrl
      this.currentVersion = updateInfo.currentVersion,
      this.newerVersion = updateInfo.newerVersion,
      this.latestVersion = updateInfo.latestVersion,
      this.latestVersionTitle = updateInfo.latestVersionTitle,
      this.latestVersionDescription = updateInfo.latestVersionDescription,
      this.installName = updateInfo.fileName
    },
    updatedPercentageCallback: function(percentage) {
      this.downloadedPercentage = `width: ${percentage}%`
    }
  },
  mounted () {
    this.checkForUpdates()
  }
}
</script>