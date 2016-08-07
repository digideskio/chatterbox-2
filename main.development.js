import { app, BrowserWindow, Menu, screen, Tray } from 'electron'
import { join } from 'path'
import windowStateKeeper from 'electron-window-state'
let mainWindow = null
let trayInstance = null

if (process.env.NODE_ENV === 'development') {
  require('electron-debug')() // eslint-disable-line global-require
}

app.on('window-all-closed', () => process.platform !== 'darwin' && app.quit())

const installExtensions = async() => {
  if (process.env.NODE_ENV === 'development') {
    const installer = require('electron-devtools-installer') // eslint-disable-line global-require
    const extensions = ['REACT_DEVELOPER_TOOLS']
    const forceDownload = !!process.env.UPGRADE_EXTENSIONS
    for (const name of extensions) {
      try {
        await installer.default(installer[name], forceDownload)
      } catch (e) {} // eslint-disable-line
    }
  }
}

app.on('ready', async() => {
  await installExtensions()

  const workAreaSize = screen.getPrimaryDisplay()
  const { manage, ...mainWindowState } = windowStateKeeper({
    defaultWidth: workAreaSize.width * 0.7,
    defaultHeight: workAreaSize.height * 0.7
  })

  const appIcon = join(__dirname, './app/images/temp_logo.png')

  mainWindow = new BrowserWindow({
    ...mainWindowState,
    show: false,
    center: true,
    minWidth: 1060,
    minHeight: 600,
    icon: appIcon,
    titleBarStyle: 'hidden'
  })

  mainWindow.setMenu(null)

  manage(mainWindow)

  initTray(appIcon)

  trayInstance.on('click', () => {
    mainWindow.show()
    mainWindow.focus()
  })

  mainWindow.loadURL(`file://${__dirname}/app/app.html`)

  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.show()
    mainWindow.focus()
  })

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  if (process.env.NODE_ENV === 'development') {
    mainWindow.openDevTools()
    mainWindow.webContents.on('context-menu', (e, { x, y }) => {
      Menu.buildFromTemplate([{
        label: 'Inspect element',
        click: () => mainWindow.inspectElement(x, y)
      }]).popup(mainWindow)
    })
  }
})


function initTray(appIcon) {
  trayInstance = new Tray(appIcon)

  let contextMenu = Menu.buildFromTemplate([{
      type: 'separator'
    },
    {
      label: 'Quit',
      click() {
        app.quit()
      }
    }
  ])
  trayInstance.setToolTip('Chatterbox')
  trayInstance.setContextMenu(contextMenu)
}
