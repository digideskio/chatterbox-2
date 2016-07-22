import React from 'react'
import { Route, IndexRoute } from 'react-router'
import App from 'containers/App'
import LoadingPage from 'containers/LoadingPage'
import MainPage from 'containers/MainPage'
import LoginPage from 'components/Login.react'


export default (
  <Route path='/' component={App}>
    <IndexRoute component={LoadingPage} />
    <Route path='/main' component={MainPage} />
    <Route path='/login/:teamType' component={LoginPage} />
  </Route>
)
