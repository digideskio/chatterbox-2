import { combineReducers } from 'redux'
import { routerReducer as routing } from 'react-router-redux'
import sidebar from './sidebar'
import titlebar from './titlebar'
import settings from './settings'
import loading from './loading'
import teams from './teams'
import login from './login'

const rootReducer = combineReducers({
  teams,
  login,
  sidebar,
  titlebar,
  settings,
  loading,
  routing
})

export default rootReducer
