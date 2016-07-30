const { ipcRenderer } = require('electron')

ipcRenderer.on('check-repick', () => {
  ipcRenderer.sendToHost('repick-needed', $('#oauth_repick').is(':visible')) // eslint-disable-line no-undef
})
