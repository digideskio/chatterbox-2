import { combineReducers } from 'redux'
import { routerReducer as routing } from 'react-router-redux'
import sidebar from './sidebar'
import titlebar from './titlebar'

const rootReducer = combineReducers({
  sidebar,
  titlebar,
  routing
})

export default rootReducer
