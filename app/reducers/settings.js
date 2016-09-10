import Database from 'lib/database'

import { SETTINGS_CHANGE, SETTINGS_RESET } from 'actions/settings'

const DEFAULT_STATE = Database.settings.defaults

export default function settings(state = Database.settings.defaults, { type, payload }) {
  switch (type) {
    case SETTINGS_CHANGE:
      return { ...state, ...payload }
    case SETTINGS_RESET:
      return DEFAULT_STATE
    default:
      return state
  }
}
