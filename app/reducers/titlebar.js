import { combineReducers } from 'redux'

import { TITLEBAR_MAXIMIZE, TITLEBAR_UNMAXIMIZE, TITLEBAR_RESTORE, TITLEBAR_MINIMIZE } from 'actions/titlebar'

const DEFAULT_STATE = {
  isMaximized: false,
  isMinimized: false,
  title: ' '
}

function isMaximized(state = DEFAULT_STATE.isMaximized, action) {
  if (action.type === TITLEBAR_MAXIMIZE) {
    return true
  } else if (action.type === TITLEBAR_UNMAXIMIZE) {
    return false
  }
  return state
}

function isMinimized(state = DEFAULT_STATE.isMinimized, action) {
  if (action.type === TITLEBAR_MINIMIZE) {
    return true
  } else if (action.type === TITLEBAR_RESTORE) {
    return false
  }
  return state
}

function title(state = DEFAULT_STATE.title, action) {
  // TODO: lol
  return state
}

export default combineReducers({
  isMaximized,
  isMinimized,
  title
})
