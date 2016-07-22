import React from 'react'
import { Route, IndexRoute } from 'react-router'
import App from 'containers/App'
import LoadingPage from 'containers/LoadingPage'
import MainPage from 'containers/MainPage'
import Login from 'components/Logins/Slack.react'


export default (
  <Route path='/' component={App}>
    <IndexRoute component={Login} />
    <Route path='/main' component={MainPage} />
  </Route>
)
