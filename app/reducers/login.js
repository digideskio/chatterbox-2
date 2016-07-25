import { PROVIDER_CHANGE } from 'actions/login'


const DEFAULT_STATE = {
  provider: { loaded: false, name: null },
  providers: ['slack', 'irc']
}

export default function settings(state = DEFAULT_STATE, { type, ...action }) {
  switch (type) {
    case PROVIDER_CHANGE:
      return {...state, provider: provider.action }
    default:
      return state
  }
}
