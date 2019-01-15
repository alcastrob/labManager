'use strict'

const semver = require('semver')
const path = require('path')
const os = require('os')
const fs = require('fs')
const https = require('https')
const { spawn } = require('child_process');
const remote = require('electron').remote
import { getConfigValue } from './dal'
import _ from 'lodash'
import axios from 'axios'

const RELEASES_URL = 'https://api.github.com/repos/alcastrob/labManager/releases'

export async function checkForUpdates () {
  var currentVersion = require('../../package.json').version
  var token = await getConfigValue('githubToken', 'labManager.sqlite')
  var responseReleases = await axios
    .get(RELEASES_URL, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

  var latestVersion, newerVersion, latestVersionTitle, latestVersionDescription, downloadUrl, fileName

  if (responseReleases.status === 200){
    latestVersion = _.map(responseReleases.data, 'tag_name').sort(semver.rcompare)[0]
    newerVersion = semver.gt(latestVersion, currentVersion)
    if (newerVersion) {
      var release = _.find(responseReleases.data, ['tag_name', latestVersion])
      var assetsUrl = release.assets[0].url
      latestVersionTitle = release.name
      latestVersionDescription = release.body.replace(/\n/g, '<br>')
      var responseAssets = await axios.get(assetsUrl, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      if (responseAssets.status === 200){
        fileName = responseAssets.data.name
        downloadUrl = responseAssets.data.browser_download_url
      } else {
        newerVersion = false
      }
    } else {
      newerVersion = false
    }
  } else {
    newerVersion = false
  }
  return {
    currentVersion: currentVersion,
    newerVersion: newerVersion,
    latestVersion: latestVersion,
    latestVersionTitle: latestVersionTitle,
    latestVersionDescription: latestVersionDescription,
    downloadUrl: downloadUrl,
    fileName: fileName
  }
}

export function downloadUpdate(downloadUrl, installName, updatedPercentageCallback) {
  var fileName = path.join(os.tmpdir(), installName)
  var file = fs.createWriteStream(fileName, {encoding: 'binary'})
  //The first request is for the 302 to AWS
  var request = https.get(downloadUrl,
    ((response) => {
      var awsUrl = response.headers.location

      var request2 = https.get(awsUrl,
        ((response2) => {
          var totalSize = parseInt(response2.headers['content-length'])
          var currentSize = 0
          response2.pipe(file)

          response2.on('data', (d) => {
            currentSize += d.length
            updatedPercentageCallback(Math.round(currentSize*100/totalSize))
            //downloadedPercentage = `width: ${Math.round(currentSize*100/totalSize)}%`
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
    fs.unlink(fileName)
  })
}