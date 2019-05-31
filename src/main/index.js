'use strict'

import {
  app,
  BrowserWindow,
  Menu,
  dialog,
  shell
} from 'electron'
import ConfigFileService from '../services/ConfigFileService'
const path = require('path')
const electron = require('electron')
const ipc = electron.ipcMain

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = path.join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development' ? `http://localhost:9080` : `file://${__dirname}/index.html`

let configFileService = new ConfigFileService()

function createWindow() {
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

var datafile = configFileService.configGet('dataFile')

var menuTemplate = [{
  label: 'Archivo',
  submenu: [{
      label: 'Nuevo fichero de datos',
      click() {
        // createAddWindow ()
      }
    },
    {
      label: 'Abrir archivo',
      click() {
        openExistingFile()
      }
    },
    {
      label: 'Abrir en Explorador de Windows',
      click() {
        openFileInShell()
      },
      enabled: !(datafile === undefined || datafile === '')
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
  submenu: [{
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
      click() {}
    }
  ]
}, {
  label: 'Vista',
  submenu: [{
      label: 'Ampliar',
      accelerator: 'Ctrl+++',
      click() {
        mainWindow.webContents.send('zoomlevel:up')
      }
    },
    {
      label: 'Reducir',
      accelerator: 'Ctrl+-',
      click() {
        mainWindow.webContents.send('zoomlevel:down')
      }
    },
    {
      type: 'separator'
    },
    {
      label: 'Restaurar vista',
      click() {
        mainWindow.webContents.send('zoomlevel:reset')
      }
    }
  ]
}]
if (configFileService.configGet('isAdmin')) {
  menuTemplate.push({
    label: 'Mantenimientos',
    submenu: [{
        label: 'Catálogo',
        click() {
          mainWindow.webContents.send('navigation:navigateTo', {
            page: '/maintenace/catalog'
          })
        }
      },
      {
        label: 'Productos y Lotes',
        click() {
          mainWindow.webContents.send('navigation:navigateTo', {
            page: '/maintenace/products'
          })
        }
      },
      {
        type: 'separator'
      },
      {
        label: 'Configuración',
        click() {
          mainWindow.webContents.send('navigation:navigateTo', {
            page: '/maintenace/configuration'
          })
        }
      }
    ]
  })
}
menuTemplate.push({
  label: 'Ayuda',
  submenu: [{
    label: 'Acerca de',
    click() {
      mainWindow.webContents.send('navigation:navigateTo', {
        page: '/about'
      })
    }
  }]
})

// due to OSX way of render menus, you must leave an empty element to make your app interoperable
if (process.platform === 'darwin') {
  menuTemplate.unshift({})
}

// if (process.env.NODE_ENV !== 'production') {
// 'production', 'staging', 'development', 'test'
menuTemplate.push({
  label: 'Desarrollo',
  submenu: [{
      label: 'Herramientas de desarrollo',
      accelerator: process.platform === 'darwing' ? 'Command+Alt+I' : 'F12',
      click(item, focusedWindow) {
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

function openFileInShell() {
  var file = configFileService.configGet('dataFile')
  if (file !== undefined) {
    shell.showItemInFolder(file)
  }
}

function openExistingFile() {
  var filePath = dialog.showOpenDialog({
    properties: ['openFile']
  })
  if (filePath !== undefined) {
    // The user selected a file and did not pressed the Cancel button of the dialog
    mainWindow.webContents.send('reload:database', filePath[0])
  }
  datafile = configFileService.configGet('dataFile')
}