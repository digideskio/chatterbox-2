import { combineReducers } from 'redux'
import { LOGIN_PROVIDER_CHANGE } from 'actions/login'

const DEFAULT_STATE = {
  provider: {
    loading: true,
    authenticating: false,
    name: null,
    error: null
  },
  providers: ['slack', 'irc']
}

function provider(state = DEFAULT_STATE.provider, action) {
  if (action.type === LOGIN_PROVIDER_CHANGE) {
    return action.provider
  }
  return state
}

function providers(state = DEFAULT_STATE.providers, action) {
  // TODO: stuff would probably be nice, maybe.
  return state
}

export default combineReducers({
  provider,
  providers
})
