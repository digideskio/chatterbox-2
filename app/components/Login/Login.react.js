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
  <ul className='login-providers'>{
    providers.map((provider, idx) =>
      <li key={idx}>
        <Link to={`/login/${provider}`}>{provider}</Link>
      </li>
    )
  }</ul>

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
