const fs = require('fs')
const mime = require('mime-types')
import { getConfigValue } from './dal.js'
import _ from 'lodash'

async function getFilePathUsingWorkId(file, workId) {
  var path = await getConfigValue('sharedPath')
  if (!path.endsWith('\\')) {
    path += '\\'
  }

  debugger
  path += workId + '_' + hash(file) + '.' + file.path.split('.').pop()
  return path
}

export async function copyFile(file, hash, workId){
  var path = await getFilePathUsingWorkId(file, workId)
  fs.copyFileSync(file.path, path)
  return path
}

export async function deleteFile(fileContent, workId){
  var path = await getFilePathUsingWorkId(fileContent, workId)
  fs.unlinkSync(path)
}

export async function getFileList(workId) {
  var path = await getConfigValue('sharedPath')
  var files = fs.readdirSync(path)
  return _.filter(files, (e) => {
    return e.startsWith(`${workId}_`)
  })
}

export function convertFromBase64(b64){
  var content = b64.replace(/data:image\/\w*;base64,/gm, '')

  return getByteArrays(atob(content))
}

function getByteArrays(byteCharacters){
  var byteArrays = []
  var sliceSize = 1024

  for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    var slice = byteCharacters.slice(offset, offset + sliceSize)

    var byteNumbers = new Array(slice.length)
    for (var i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i)
    }

    var byteArray = new Uint8Array(byteNumbers)

    byteArrays.push(byteArray)
  }
  return byteArrays
}

export function getFileType(file) {
  const regex = /\/\w*;/gm
  //Nice to have: Named groups would be best for this extraction, but the framework is not ready yet.
  return  regex.exec(file)[0].replace('/', '').replace(';', '')
}

export function hash(data){
  var hash = 0, i, chr
  if (data.length === 0) return hash
  for (i = 0; i < data.length; i++) {
    chr   = data.charCodeAt(i)
    hash  = ((hash << 5) - hash) + chr
    hash |= 0 // Convert to 32bit integer
  }
  return hash
}

export function saveFile(file, path){
  var binaryArrays = convertFromBase64(file)
    var stream = fs.createWriteStream(path)
    for (var array of binaryArrays){
      stream.write(array)
    }
    stream.end()
}

export async function turnFileIntoB64(fileName){
  var path = await getConfigValue('sharedPath')
  if (!path.endsWith('\\')) {
    path += '\\'
  }
  var content = fs.readFileSync(path + fileName, 'binary')
  var y = getByteArrays(content)
  var x = new File(y, path + fileName, {type: mime.lookup(fileName)})
  return x

  // var content = fs.readFileSync(path + fileName, 'binary')
  // var ext = fileName.split('.').pop()
  // if (ext === 'jpg') ext = 'jpeg'
  // var b64 = `data:image/${ext};base64,`
  // b64 += new Buffer(content).toString('base64');
  // return b64

}