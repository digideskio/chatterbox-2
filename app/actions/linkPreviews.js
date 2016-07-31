import { remote } from 'electron'

const previewTakingWindowCodeInject = `
const { ipcRenderer, remote } = require('electron')

ipcRenderer.on('take-screenshot', () => {
  remote.getCurrentWindow().capturePage(img => {
    ipcRenderer.sendToHost('screenshot', img.toPng()) // eslint-disable-line no-undef
  })
})
`


const previewTakingWindow = new remote.BrowserWindow({
  useContentSize: true,
  show: false,
  enableLargerThanScreen: true,
  skipTaskbar: true,
  webPreferences: {
    nodeIntegration: false,
    backgroundThrottling: true,
    preload: previewTakingWindowCodeInject
  }
})


export const LINK_PREVIEW_ADD = 'LINK_PREVIEW_ADD'

export function loadPreview(linkURL) {
  return (dispatch) => {
    previewTakingWindow.loadURL(linkURL)

    previewTakingWindow.once('screenshot', (img) => {
      console.log(img)
    })

    previewTakingWindow.once('ready-to-show', () => {
      previewTakingWindow.webContents.send('take-screenshot')
    })

    //dispatch({ type: LINK_PREVIEW_ADD, payload })
  }
}
