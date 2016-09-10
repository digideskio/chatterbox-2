import { combineReducers } from 'redux'
import { routerReducer as routing } from 'react-router-redux'

import settings from './settings'
import loading from './loading'
import teams from './teams'
import messages from './messages'
import login from './login'
import linkPreviews from './linkPreviews'

export default combineReducers({
  routing,
  linkPreviews,
  teams,
  login,
  messages,
  settings,
  loading
})
