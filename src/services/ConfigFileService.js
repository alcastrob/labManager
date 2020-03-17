// eslint-disable-next-line no-unused-expressions
'use strict'

import log from 'loglevel'

const electron = require('electron')
const path = require('path')
const fs = require('fs')

export default class ConfigFileService {
  constructor() {
    if (!this.lodaded) {
      const userDataPath = (electron.app || electron.remote.app).getPath('appData')
      const filePath = path.join(userDataPath, 'labManager', 'labManager.json')
      this.data = {}
      this.loaded = false
      this.loadDataFile(filePath)
    }
  }

  dumpToLogger() {
    log.debug(`Loaded the local config file. Config file contents: ${JSON.stringify(this.data)}`)
  }

  loadDataFile(filePath) {
    if (fs.existsSync(filePath)) {
      this.data = JSON.parse(fs.readFileSync(filePath))
      log.debug(`Loaded the local config file. Config file contents: ${JSON.stringify(this.data)}`)
    } else {
      // The config file does not exist. Let's create a dummy one.
      this.data = {
        isAdmin: false,
        dataFile: '.',
        productCatalog: true,
        zoomLevel: 1
      }
      fs.writeFileSync(filePath, JSON.stringify(this.data))
      log.info(`Created a dummy config file. Config file contents: ${JSON.stringify(this.data)}`)
    }
    this.loaded = true
  }

  configGet(key) {
    if (this.data[key] === 'true') {
      return true
    } else if (this.data[key] === 'false') {
      return false
    } else {
      return this.data[key]
    }
  }

  configSet(key, val) {
    const userDataPath = (electron.app || electron.remote.app).getPath('appData')
    const filePath = path.join(userDataPath, 'labManager', 'labManager.json')
    if (fs.existsSync(filePath)) {
      this.data = JSON.parse(fs.readFileSync(filePath))
    }
    this.data[key] = val
    this.loaded = true
    fs.writeFileSync(filePath, JSON.stringify(this.data))
    log.info(`Updated the local config file. Config file contents: ${JSON.stringify(this.data)}`)
  }
}