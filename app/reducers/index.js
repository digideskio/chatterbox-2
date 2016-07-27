import { combineReducers } from 'redux'
import { routerReducer as routing } from 'react-router-redux'
import titlebar from './titlebar'
import settings from './settings'
import loading from './loading'
import teams from './teams'
import messages from './messages'
import login from './login'

const rootReducer = combineReducers({
  teams,
  login,
  messages,
  titlebar,
  settings,
  loading,
  routing
})

export default rootReducer
