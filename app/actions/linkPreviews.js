import { remote } from 'electron'

export const LINK_PREVIEW_ADD = 'LINK_PREVIEW_ADD'
export const LINK_PREVIEW_LOADING = 'LINK_PREVIEW_LOADING'


export function loadPreview(linkURL) {
  return (dispatch, getState) => {
    if (getState().linkPreviews.loading.includes(linkURL)) return
    dispatch({ type: LINK_PREVIEW_LOADING, payload: linkURL })

    const previewTakingWindow = new remote.BrowserWindow({ show: false, fullscreen: true, useContentSize: true, webPreferences: { nodeIntegration: false } })
    previewTakingWindow.loadURL(linkURL)
    previewTakingWindow.webContents.setAudioMuted(true)

    previewTakingWindow.webContents.once('did-finish-load', () => previewTakingWindow.capturePage(image => {
      previewTakingWindow.destroy()
      const base64 = new Buffer(image.toPng()).toString('base64')
      dispatch({ type: LINK_PREVIEW_ADD, payload: { link: linkURL, src: base64 } })
    }))
  }
}
