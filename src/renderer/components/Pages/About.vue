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
          <div class="progress-bar bg-info progress-bar-striped progress-bar-animated" :style="percentage"></div>
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
const semver = require('semver')
const path = require('path')
const os = require('os')
const fs = require('fs')
const https = require('https')
const { spawn } = require('child_process');
const remote = require('electron').remote
import axios from 'axios'
import _ from 'lodash'

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
      downloadedPercentage: 0
    }
  },
  methods: {
    getLatestReleaseData(responseReleases){
      if (responseReleases.status === 200){
        this.latestVersion = _.map(responseReleases.data, 'tag_name').sort(semver.rcompare)[0]
        this.newerVersion = semver.gt(this.latestVersion, this.currentVersion)
        if (this.newerVersion) {
          var release = _.find(responseReleases.data, ['tag_name', this.latestVersion])
          var assets = release.assets[0].url
          this.latestVersionTitle = release.name
          this.latestVersionDescription = release.body.replace(/\n/g, '<br>')

          axios
            .get(assets)
            .then(this.getDownloadLink)
        } else {
          this.newerVersion = false
        }
      } else {
        this.newerVersion = false
      }
    },
    getDownloadLink(responseAssets){
      if (responseAssets.status === 200){
        this.downloadUrl = responseAssets.data.browser_download_url
        this.installName = responseAssets.data.name
      } else {
        this.newerVersion = false
      }
    },
    download() {
      this.downloading = true
      var fileName = path.join(os.tmpdir(), this.installName)
      var file = fs.createWriteStream(fileName, {encoding: 'binary'})
      //First request is for the 302 to AWS
      var request = https.get(this.downloadUrl,
        ((response) => {
          var awsUrl = response.headers.location

          var request2 = https.get(awsUrl,
            ((response2) => {
              var totalSize = parseInt(response2.headers['content-length'])
              var currentSize = 0
              response2.pipe(file)

              response2.on('data', (d) => {
                currentSize += d.length
                this.downloadedPercentage = Math.round(currentSize*100/totalSize)
              })
              response2.on('end', () => {
                file.close()
                //The new process will continue running after the application is shutted down.
                var installerProcess = spawn(fileName, [], {
                  detached: true,
                  stdio: 'ignore'
                })
                installerProcess.unref()
                remote.getCurrentWindow().close()
              })
            })
          )
        })
      ).on('error', function(err) {
        debugger
        fs.unlink(fileName)
      })
    }
  },
  computed: {
    percentage: function() {
      return `width: ${this.downloadedPercentage}%`
    }
  },
  mounted () {
    this.currentVersion = require('../../../../package.json').version
    axios
      .get('https://api.github.com/repos/alcastrob/labManager/releases')
      .then(this.getLatestReleaseData)
  }
}
</script>

<style>
</style>
