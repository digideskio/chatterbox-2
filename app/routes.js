import React from 'react'
import { Route, IndexRoute } from 'react-router'
import App from 'containers/App'
import LoadingPage from 'containers/LoadingPage'
import MainPage from 'containers/MainPage'


export default (
  <Route path="/" component={App}>
    <IndexRoute component={MainPage} />
  </Route>
)
