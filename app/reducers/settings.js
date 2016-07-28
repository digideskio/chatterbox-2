import Database from 'lib/database'

import { SETTINGS_CHANGE, SETTINGS_RESET, SETTINGS_SET } from 'actions/settings'

const DEFAULT_STATE = {
  loaded: 0,
  ...Database.settings.defaults
}

export default function settings(state = DEFAULT_STATE, { type, ...action }) {
  switch (type) {
    case SETTINGS_CHANGE:
      return { ...state, [action.setting]: action.value }
    case SETTINGS_SET:
      return Object.assign({}, state, action)
    case SETTINGS_RESET:
      return Object.assign({}, DEFAULT_STATE, { loaded: 100 })
    default:
      return state
  }
}
