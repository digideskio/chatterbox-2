import { remote } from 'electron'

export const RESTORE = 'TITLEBAR_RESTORE'
export const CLOSE = 'TITLEBAR_CLOSE'
export const QUIT = 'TITLEBAR_QUIT'
export const MINIMIZE = 'TITLEBAR_MAXIMIZE'
export const MAXIMIZE = 'TITLEBAR_MAXIMIZE'
export const UNMAXIMIZE = 'TITLEBAR_UNMAXIMIZE'
export const TITLE_CHANGE = 'TITLEBAR_TITLE_CHANGE'


export function toggleMaximize(maximize) {
  const CurrentWindow = remote.getCurrentWindow()
  maximize ? CurrentWindow.maximize() : CurrentWindow.unmaximize()
  return { type: maximize ? MAXIMIZE : UNMAXIMIZE }
}

export function toggleMinimize(minimize, vanillaAction = false) {
  const CurrentWindow = remote.getCurrentWindow()
  minimize && !vanillaAction ? CurrentWindow.minimize() : CurrentWindow.restore()
  return { type: minimize ? MINIMIZE : RESTORE }
}
