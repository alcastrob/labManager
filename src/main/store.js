const electron = require('electron');
const path = require('path');
const fs = require('fs');

var data = {}
var loaded = false

export function configGet(key){
  if (!loaded){
    const userDataPath = (electron.app || electron.remote.app).getPath('appData')
    const filePath = path.join(userDataPath, 'labManager', 'labManager.json')
    data = JSON.parse(fs.readFileSync(filePath))
    loaded = true
  }
  if (data[key] == 'true')
    return true
  else if (data[key] == 'false')
    return false
  else
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