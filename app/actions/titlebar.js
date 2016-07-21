import { remote } from 'electron'

export const RESTORE = 'RESTORE'
export const MINIMIZE = 'MAXIMIZE'
export const MAXIMIZE = 'MAXIMIZE'
export const UNMAXIMIZE = 'UNMAXIMIZE'
export const TITLE_CHANGE = 'TITLE_CHANGE'


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
