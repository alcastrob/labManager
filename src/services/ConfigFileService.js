// eslint-disable-next-line no-unused-expressions
'use strict'

import log from 'loglevel'

const electron = require('electron')
const path = require('path')
const fs = require('fs')

export default class ConfigFileService {
  constructor() {
    this.data = {}
    this.loaded = false
  }

  configGet(key) {
    if (!this.loaded) {
      const userDataPath = (electron.app || electron.remote.app).getPath('appData')
      const filePath = path.join(userDataPath, 'labManager', 'labManager.json')
      this.data = JSON.parse(fs.readFileSync(filePath))
      this.loaded = true
      log.info(`Loaded the local config file. Config file contents: ${JSON.stringify(this.data)}`)
    }
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