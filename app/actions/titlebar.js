import { remote } from 'electron'

export const TITLEBAR_RESTORE = 'TITLEBAR_RESTORE'
export const TITLEBAR_CLOSE = 'TITLEBAR_CLOSE'
export const TITLEBAR_QUIT = 'TITLEBAR_QUIT'
export const TITLEBAR_MINIMIZE = 'TITLEBAR_MAXIMIZE'
export const TITLEBAR_MAXIMIZE = 'TITLEBAR_MAXIMIZE'
export const TITLEBAR_UNMAXIMIZE = 'TITLEBAR_UNMAXIMIZE'
export const TITLEBAR_TITLE_CHANGE = 'TITLEBAR_TITLE_CHANGE'


export function toggleMaximize(maximize) {
  const CurrentWindow = remote.getCurrentWindow()
  maximize ? CurrentWindow.maximize() : CurrentWindow.unmaximize()
  return { type: maximize ? TITLEBAR_MAXIMIZE : TITLEBAR_UNMAXIMIZE }
}

export function toggleMinimize(minimize, vanillaAction = false) {
  const CurrentWindow = remote.getCurrentWindow()
  minimize && !vanillaAction ? CurrentWindow.minimize() : CurrentWindow.restore()
  return { type: minimize ? TITLEBAR_MINIMIZE : TITLEBAR_RESTORE }
}
