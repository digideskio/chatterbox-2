import React from 'react'
import { Route, IndexRoute } from 'react-router'
import App from 'containers/App'
import LoadingPage from 'containers/LoadingPage'
import ChatPage from 'containers/ChatPage'
import LoginPage from 'containers/LoginPage'


export default (
  <Route path='/' component={App}>
    <IndexRoute component={LoadingPage} />
    <Route path='/chat/:teamID' component={ChatPage} />
    <Route path='/login/:teamType' component={LoginPage} />
  </Route>
)
