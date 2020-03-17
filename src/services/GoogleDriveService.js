// eslint-disable-next-line no-unused-expressions
'use strict'

import log from 'loglevel'

const fs = require('fs')
const path = require('path')
const readline = require('readline')
const {
  google
} = require('googleapis')

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/drive.readonly']
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json'

export default class GoogleDriveService {
  constructor() {
    log.debug('GoogleDriveService initialized')
  }

  async openGoogleDriveDB(credentialPath, downloadPath) {
    // Load client secrets from a local file.
    try {
      const content = fs.readFileSync(credentialPath)
      // Authorize a client with credentials, then call the Google Drive API.
      await this.authorize(JSON.parse(content), path.dirname(credentialPath), downloadPath, this.downloadFile)
    } catch (err) {
      log.error(`Error loading client secret file: ${err}`)
    }
  }

  async authorize(credentials, path, downloadedPath, callback) {
    try {
      const {
        // eslint-disable-next-line camelcase
        client_secret,
        // eslint-disable-next-line camelcase
        client_id,
        // eslint-disable-next-line camelcase
        redirect_uris
      } = credentials.installed
      const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0])

      const content = JSON.parse(fs.readFileSync(`${path}\\${TOKEN_PATH}`))
      oAuth2Client.setCredentials(content)
      await callback(oAuth2Client, content.fileId, downloadedPath)
    } catch (err) {
      log.error(`Error authorizing the call to Google Drive: ${err}`)
    }
  }

  /**
   * Get and store new token after prompting for user authorization, and then
   * execute the given callback with the authorized OAuth2 client.
   * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
   * @param {getEventsCallback} callback The callback for the authorized client.
   */
  getAccessToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES
    })
    log.info('Authorize this app by visiting this url:', authUrl)
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    })
    rl.question('Enter the code from that page here: ', code => {
      rl.close()
      oAuth2Client.getToken(code, (err, token) => {
        if (err) return console.error('Error retrieving access token', err)
        oAuth2Client.setCredentials(token)
        // Store the token to disk for later program executions
        fs.writeFile(TOKEN_PATH, JSON.stringify(token), err => {
          if (err) return log.error(err)
          log.info('Token stored to', TOKEN_PATH)
        })
        callback(oAuth2Client)
      })
    })
  }

  /**
   * Lists the names and IDs of up to 100 files.
   * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
   */
  listFiles(auth) {
    const drive = google.drive({
      version: 'v3',
      auth
    })
    drive.files.list({
        pageSize: 100,
        fields: 'nextPageToken, files(id, name)'
      },
      (err, res) => {
        if (err) {
          log.error('The API returned an error: ' + err)
          return
        }
        const files = res.data.files
        if (files.length) {
          log.info('Files:')
          files.map(file => {
            log.info(`${file.name}(${file.id})`)
          })
        } else {
          log.error('No files found.')
        }
      }
    )
  }

  async downloadFile(auth, driveFileId, downloadedPath) {
    try {
      const drive = google.drive({
        version: 'v3',
        auth
      })

      const fileContent = await drive.files.get({
        fileId: driveFileId,
        alt: 'media'
      }, {
        responseType: 'arraybuffer'
      })
      fs.writeFileSync(downloadedPath, Buffer.from(fileContent.data), {
        encoding: 'binary'
      })
    } catch (err) {
      log.error(`Error downloading the file from Google Drive: ${err}`)
    }
  }
}