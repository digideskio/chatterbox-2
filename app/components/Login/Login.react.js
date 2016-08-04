/* eslint-disable react/prop-types */
import React from 'react'
import { Link } from 'react-router'
import Modal from 'react-modal'

import SlackLogin from './Slack'

const IrcLogin = () =>
  <div>todo</div>

const Login = ({ providers, addTeam, showLogin, routeParams }) =>
  <div className='login'>
    <ProviderList providers={providers} />
    <ProviderModal provider={routeParams.provider} addTeam={addTeam} showLogin={showLogin} />
  </div>

const ProviderList = ({providers}) =>
  <div className='login-providers'>
    <h3>Select a service</h3>
    <ul>{
      Object.keys(providers).map((provider) =>
        <li key={provider}>
          <Link to={`/login/${provider}`}>
            {providers[provider].icon ? <img className='provider-icon' src={providers[provider].icon} /> : null}
            {providers[provider].name}
          </Link>
        </li>
      )
    }</ul>
  </div>

const ProviderModal = ({provider, addTeam, showLogin}) => {
  if (!provider) return null

  const onClose = () => {
    showLogin()
  }

  return <Modal isOpen className='modal-login' onRequestClose={onClose}>{
    ({
      'slack': <SlackLogin addTeam={addTeam} />,
      'irc': <IrcLogin />
    })[provider] || null
  }</Modal>
}

export default Login
