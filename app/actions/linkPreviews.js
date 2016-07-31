import { remote } from 'electron'
import fs from 'fs'
import path from 'path'


export const LINK_PREVIEW_ADD = 'LINK_PREVIEW_ADD'
export const LINK_PREVIEW_LOADING = 'LINK_PREVIEW_LOADING'
const linkPreviewsTempDir = path.join(remote.app.getPath('appData'), remote.app.getName(), 'link-previews')
if (!fs.existsSync(linkPreviewsTempDir)) {
  fs.mkdirSync(linkPreviewsTempDir)
}


export function loadPreview(linkURL) {
  return (dispatch, getState) => {
    console.log(getState())
    if (getState().linkPreviews.loading.includes(linkURL)) return

    const escapedURL = encodeURIComponent(linkURL)
    dispatch({ type: LINK_PREVIEW_LOADING, linkURL })

    const previewTakingWindow = new remote.BrowserWindow({ show: false, fullscreen: true, useContentSize: true, webPreferences: { nodeIntegration: false } })
    previewTakingWindow.loadURL(linkURL)
    previewTakingWindow.webContents.setAudioMuted(true)
    previewTakingWindow.webContents.once('did-finish-load', () => previewTakingWindow.capturePage(image => {
      const imagePath = path.join(linkPreviewsTempDir, `${escapedURL}.png`)
      fs.writeFile(imagePath, image.toPng(), (err) => {
        if (err) console.error(err)
        previewTakingWindow.destroy()
        dispatch({ type: LINK_PREVIEW_ADD, payload: { link: linkURL, src: imagePath } })
      })
    }))
  }
}
