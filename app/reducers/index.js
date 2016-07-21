import { combineReducers } from 'redux'
import { routerReducer as routing } from 'react-router-redux'
import sidebar from './sidebar'
import titlebar from './titlebar'
import settings from './settings'

const rootReducer = combineReducers({
  sidebar,
  titlebar,
  settings,
  routing
})

export default rootReducer
