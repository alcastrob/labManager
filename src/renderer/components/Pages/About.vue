<template>
<div class="container">
    <h1>Acerca de labManager</h1>
    <div class="row">
      <div class="col-md-1">
        <img src="static/Tooth-64.png" alt="applicationLogo" class="mt-3">
        <!-- <img src="/dist/electron/static/Tooth-64.png" alt="applicationLogo" class="mt-3"> -->
      </div>
      <div class="col-md-11">
        <h3>versión {{currentVersion}}</h3>
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
        <p class="text-justify">Esta aplicación permite realizar la gestión de trabajos de un laboratorio protésico dental. Ha sido desarrollada por Ángel Castro y se distribuye bajo los términos de la siguiente licencia MIT:</p>
        <pre class="p-2" style="border: 1px solid #454849; background-color:#DDD8D2;white-space:pre-wrap; word-wrap:break-word;">
Copyright 2019 Ángel Castro

Se concede permiso por la presente, libre de cargos, a cualquier persona que obtenga una copia de este software y de los archivos de documentación asociados (el "Software"), a utilizar el Software sin restricción, incluyendo sin limitación los derechos a usar, copiar, modificar, fusionar, publicar, distribuir, sublicenciar, y/o vender copias del Software, y a permitir a las personas a las que se les proporcione el Software a hacer lo mismo, sujeto a las siguientes condiciones:

El aviso de copyright anterior y este aviso de permiso se incluirán en todas las copias o partes sustanciales del Software.

EL SOFTWARE SE PROPORCIONA "COMO ESTÁ", SIN GARANTÍA DE NINGÚN TIPO, EXPRESA O IMPLÍCITA, INCLUYENDO PERO NO LIMITADO A GARANTÍAS DE COMERCIALIZACIÓN, IDONEIDAD PARA UN PROPÓSITO PARTICULAR E INCUMPLIMIENTO. EN NINGÚN CASO LOS AUTORES O PROPIETARIOS DE LOS DERECHOS DE AUTOR SERÁN RESPONSABLES DE NINGUNA RECLAMACIÓN, DAÑOS U OTRAS RESPONSABILIDADES, YA SEA EN UNA ACCIÓN DE CONTRATO, AGRAVIO O CUALQUIER OTRO MOTIVO, DERIVADAS DE, FUERA DE O EN CONEXIÓN CON EL SOFTWARE O SU USO U OTRO TIPO DE ACCIONES EN EL SOFTWARE.
        </pre>
      </div>
    </div>
    <p class="text-justify">Toda la información de esta aplicación se encuentra disponible libremente en la página <a href="https://github.com/alcastrob/labManager" @click="urlClicked($event)">https://github.com/alcastrob/labManager</a>
    </p>
    <p class="text-left">Los elementos externos que han sido licenciados para esta aplicación son:
    <ul>
        <li>
          Icono de la aplicación diseñado por <a href="https://www.iconspedia.com/icon/tooth-icon-29053.html" @click="urlClicked($event)">BanzaiTokyo</a>. Licencia CC Attribution
        </li>
        <li>
          Plantilla HTML diseñada por <a href="https://startbootstrap.com/template-overviews/sb-admin/" @click="urlClicked($event)">Start Bootstrap</a>. Licencia MIT
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
    },
    urlClicked (event) {
      var url = event.srcElement.attributes['href'].value
      event.preventDefault()
      require('electron').shell.openExternal(url)
    }
  },
  mounted () {
    this.checkForUpdates()
  }
}
</script>