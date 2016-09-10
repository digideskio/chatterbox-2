import { createStore as _createStore, applyMiddleware, compose } from 'redux'
import clientPromiseMiddleware from './middleware/clientPromiseMiddleware'
import { routerMiddleware } from 'react-router-redux'

const __DEVELOPMENT__ = process.env.NODE_ENV !== 'production'

export default function createStore(history) {
  // Sync dispatched route actions to the history
  const reduxRouterMiddleware = routerMiddleware(history)
  const middleware = [clientPromiseMiddleware(), reduxRouterMiddleware]

  let finalCreateStore
  if (__DEVELOPMENT__) {
    const { persistState } = require('redux-devtools')
    finalCreateStore = compose(
      applyMiddleware(...middleware),
      window.devToolsExtension(),
      persistState(window.location.href.match(/[?&]debug_session=([^&]+)\b/))
    )(_createStore)
  } else {
    finalCreateStore = applyMiddleware(...middleware)(_createStore)
  }

  const reducer = require('../reducers')
  const store = finalCreateStore(reducer)

  if (__DEVELOPMENT__ && module.hot) {
    module.hot.accept('../reducers', () => {
      store.replaceReducer(require('../reducers'))
    })
  }

  return store
}
