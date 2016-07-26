import { PROVIDER_CHANGE, PROVIDER_ERROR } from 'actions/login'


const DEFAULT_STATE = {
  provider: { loading: true, authenticating: false, name: null, error: null },
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
