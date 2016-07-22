import { combineReducers } from 'redux'
import { routerReducer as routing } from 'react-router-redux'
import sidebar from './sidebar'
import titlebar from './titlebar'
import settings from './settings'
import loading from './loading'

const rootReducer = combineReducers({
  sidebar,
  titlebar,
  settings,
  loading,
  routing
})

export default rootReducer
