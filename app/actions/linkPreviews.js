import { remote } from 'electron'

const previewTakingWindow = new remote.BrowserWindow({
  useContentSize: true,
  show: false,
  enableLargerThanScreen: true,
  skipTaskbar: true,
  webPreferences: {
    nodeIntegration: false,
    backgroundThrottling: true
  }
})


export const LINK_PREVIEW_ADD = 'LINK_PREVIEW_ADD'

export function loadPreview(linkURL) {
  return (dispatch) => {

    previewTakingWindow.loadURL(linkURL)
    previewTakingWindow.once('ready-to-show', () => {

    })

    //dispatch({ type: LINK_PREVIEW_ADD, payload })
  }
}
