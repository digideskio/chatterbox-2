import { CHANGE, RESET, SET } from 'actions/settings'
import Database from 'lib/database'

const DEFAULT_STATE = { loaded: 0, ...Database.settings.defaults }

export default function settings(state = DEFAULT_STATE, { type, ...action }) {
  switch (type) {
    case CHANGE:
      return {...state, [action.setting]: action.value }
    case SET:
      return Object.assign({}, state, action)
    case RESET:
      return Object.assign({}, DEFAULT_STATE, { loaded: 100 })
    default:
      return state
  }
}
