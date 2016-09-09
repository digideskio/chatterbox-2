import React from 'react'
import { Route, IndexRoute } from 'react-router'
import { App, LoadingPage, ChatPage, LoginPage } from 'containers'

export default (
  <Route path='/' component={App}>
    <IndexRoute component={LoadingPage} />
    <Route path='/chat' component={ChatPage} />
    <Route path='/login' component={LoginPage} />
    <Route path='/login/:provider' component={LoginPage} />
  </Route>
)
