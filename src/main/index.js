'use strict'

import { app, BrowserWindow, Menu, dialog } from 'electron'
const path = require('path')
const log = require('electron-log')
const electron = require('electron')
const ipc = electron.ipcMain
import { configGet } from '../main/store'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = path.join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development' ? `http://localhost:9080` : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 1024,
    icon: path.join(__static, 'tooth.ico')
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
    app.quit()
  })

  const mainMenu = Menu.buildFromTemplate(menuTemplate)
  Menu.setApplicationMenu(mainMenu)
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

ipc.on('file:opened', function (event, content) {
  mainWindow.setTitle(`labManager (${require('../../package.json').version}) - [${content}]`)
})

var menuTemplate = [{
  label: 'Archivo',
  submenu: [
    {
      label: 'Nuevo fichero de datos',
      click () {
        // createAddWindow ()
      }
    },
    {
      label: 'Abrir archivo',
      click () {
        openExistingFile()
      }
    },
    {
      label: 'Guardar copia de seguridad',
      click () {
        // mainWindow.webContents.send('todo:clear')
      }
    },
    {
      type: 'separator'
    },
    {
      label: 'Salir',
      accelerator: process.platform === 'darwing' ? 'Command+Q' : 'Alt+F4',
      role: 'quit'
    }
  ]
}, {
  label: 'Edición',
  submenu: [
    {
      label: 'Deshacer',
      accelerator: 'Ctrl+Z',
      role: 'undo'
    },
    {
      label: 'Rehacer',
      accelerator: 'Ctrl+Y',
      role: 'redo'
    },
    {
      type: 'separator'
    },
    {
      label: 'Cortar',
      accelerator: 'Ctrl+X',
      role: 'cut'
    },
    {
      label: 'Copiar',
      accelerator: 'Ctrl+C',
      role: 'copy'
    },
    {
      label: 'Pegar',
      accelerator: 'Ctrl+V',
      role: 'paste'
    },
    {
      type: 'separator'
    },
    {
      label: 'Buscar',
      accelerator: 'Ctrl+B',
      click () {}
    }
  ]
}]
if (configGet('isAdmin')){
  menuTemplate.push({
    label: 'Mantenimientos',
    submenu: [
      {
        label: 'Catálogo',
        click () {
          mainWindow.webContents.send
          ('navigation:navigateTo', {page: '/maintenace/catalog'})
        }
      },
      {
        label: 'Productos y Lotes',
        click () {
          mainWindow.webContents.send
          ('navigation:navigateTo', {page: '/maintenace/products'})
        }
      }
    ]
  })
}
menuTemplate.push({
  label: 'Ayuda',
  submenu: [
    {
      label: 'Acerca de',
      click () {
        mainWindow.webContents.send
        ('navigation:navigateTo', {page: '/about'})
      }
    }
  ]
})


// due to OSX way of render menus, you must leave an empty element to make your app interoperable
if (process.platform === 'darwin') {
  menuTemplate.unshift({})
}

// if (process.env.NODE_ENV !== 'production') {
  // 'production', 'staging', 'development', 'test'
  menuTemplate.push({
    label: 'Desarrollo',
    submenu: [
      {
        label: 'Herramientas de desarrollo',
        accelerator: process.platform === 'darwing' ? 'Command+Alt+I' : 'F12',
        click (item, focusedWindow) {
          focusedWindow.toggleDevTools()
        }
      },
      {
        label: 'Recargar',
        role: 'reload'
        // For reloading the full page inside the window
      }
    ]
  })
// }

function openExistingFile(){
  var filePath = dialog.showOpenDialog({
    properties: ['openFile']
  })
  if (filePath !== undefined) {
    //The user selected a file and did not pressed the Cancel button of the dialog
    mainWindow.webContents.send('reload:database', filePath[0])
  }
}

// const remote = require('remote')
// const Menu1 = remote.require('menu')
// const MenuItem1 = remote.require('menu-item')

// let rightClickPosition = null

// const contextualMenu = new Menu1()
// const menuItem = new MenuItem1(
//   {
//     label: 'Inspeccionar elemento',
//     click () {
//       remote.getCurrentWindow().inspectElement(rightClickPosition.x, rightClickPosition.y)
//     }
//   }
// )
// contextualMenu.append(menuItem)

// window.addEventListener('contextmenu', (e) => {
//   e.preventDefault()
//   rightClickPosition = {
//     x: event.x,
//     y: event.y
//   }
//   contextualMenu.popup(remote.getCurrentWindow())
// }, false)

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
