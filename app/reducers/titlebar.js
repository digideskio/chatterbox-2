import { MAXIMIZE, UNMAXIMIZE, RESTORE, MINIMIZE, TITLE_CHANGE } from 'actions/titlebar'

const DEFAULT_STATE = {
  isMaximized: false,
  isMinimized: false,
  title: ' '
}


export default function sidebar(state = DEFAULT_STATE, { type, ...action }) {
  switch (type) {
    case UNMAXIMIZE:
      return {...state, isMaximized: false }
    case MAXIMIZE:
      return {...state, isMaximized: true }
    case MINIMIZE:
      return {...state, isMinimized: true }
    case RESTORE:
      return {...state, isMinimized: false }
    default:
      return state
  }
}
