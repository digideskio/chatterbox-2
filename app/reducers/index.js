import { combineReducers } from 'redux'
import { routerReducer as routing } from 'react-router-redux'
import titlebar from './titlebar'
import settings from './settings'
import loading from './loading'
import teams from './teams'
import login from './login'

const rootReducer = combineReducers({
  teams,
  login,
  titlebar,
  settings,
  loading,
  routing
})

export default rootReducer
