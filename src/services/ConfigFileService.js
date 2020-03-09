// eslint-disable-next-line no-unused-expressions
'use strict'

import log from 'loglevel'

const electron = require('electron')
const path = require('path')
const fs = require('fs')

export default class ConfigFileService {
  static data = {}
  static loaded = false

  constructor() {
    // ConfigFileService.data = {}
    // ConfigFileService.loaded = false
    if (!ConfigFileService.lodaded) {
      const userDataPath = (electron.app || electron.remote.app).getPath('appData')
      const filePath = path.join(userDataPath, 'labManager', 'labManager.json')
      this.loadDataFile(filePath)
    }
  }

  dumpToLogger() {
    log.debug(`Loaded the local config file. Config file contents: ${JSON.stringify(this.data)}`)
  }

  loadDataFile(filePath) {
    if (fs.existsSync(filePath)) {
      ConfigFileService.data = JSON.parse(fs.readFileSync(filePath))
      log.debug(`Loaded the local config file. Config file contents: ${JSON.stringify(ConfigFileService.data)}`)
    } else {
      // The config file does not exist. Let's create a dummy one.
      ConfigFileService.data = {
        isAdmin: false,
        dataFile: '.',
        productCatalog: true,
        zoomLevel: 1
      }
      fs.writeFileSync(filePath, JSON.stringify(ConfigFileService.data))
      log.info(`Created a dummy config file. Config file contents: ${JSON.stringify(ConfigFileService.data)}`)
    }
    ConfigFileService.loaded = true
  }

  configGet(key) {
    if (ConfigFileService.data[key] === 'true') {
      return true
    } else if (ConfigFileService.data[key] === 'false') {
      return false
    } else {
      return ConfigFileService.data[key]
    }
  }

  configSet(key, val) {
    const userDataPath = (electron.app || electron.remote.app).getPath('appData')
    const filePath = path.join(userDataPath, 'labManager', 'labManager.json')
    if (fs.existsSync(filePath)) {
      ConfigFileService.data = JSON.parse(fs.readFileSync(filePath))
    }
    ConfigFileService.data[key] = val
    ConfigFileService.loaded = true
    fs.writeFileSync(filePath, JSON.stringify(ConfigFileService.data))
    log.info(`Updated the local config file. Config file contents: ${JSON.stringify(ConfigFileService.data)}`)
  }

  // Readonly is not stored in the configuration file, so it needs its own specialized getter & setter
  configGetReadOnly() {
    return ConfigFileService.data['readonly'] === true
  }

  configSetReadOnly(value) {
    ConfigFileService.data['readonly'] = value
  }
}