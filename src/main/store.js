const electron = require('electron');
const path = require('path');
const fs = require('fs');

var data = {}
var loaded = false

export function configGet(key){
  const userDataPath = (electron.app || electron.remote.app).getPath('appData')
  const filePath = path.join(userDataPath, 'labManager', 'labManager.json')
  if (!loaded){
    data = JSON.parse(fs.readFileSync(filePath))
    loaded = true
  }
  return data[key]
}

export function configSet(key, val){
  const userDataPath = (electron.app || electron.remote.app).getPath('appData')
  const filePath = path.join(userDataPath, 'labManager', 'labManager.json')
  if (fs.existsSync(filePath)){
    data = JSON.parse(fs.readFileSync(filePath))
  }
  data[key] = val
  fs.writeFileSync(filePath, JSON.stringify(data))
}