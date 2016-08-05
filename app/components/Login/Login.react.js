import React, { PropTypes, PureComponent } from 'react'
import { Link } from 'react-router'
import Modal from 'react-modal'

import SlackLogin from './Slack'

class Login extends PureComponent {
  static propTypes = {
    providers: PropTypes.object.isRequired,
    showLogin: PropTypes.func.isRequired,
    addTeam: PropTypes.func.isRequired
  }

  render() {
    const { providers, routeParams, showLogin, addTeam } = this.props
    return (
      <div className='login'>
        <ProviderList providers={providers} />
        <ProviderModal provider={routeParams.provider} addTeam={addTeam} showLogin={showLogin} />
      </div>
    )
  }
}

class ProviderList extends PureComponent {
  static propTypes = {
    providers: PropTypes.object.isRequired
  }

  render() {
    const { providers } = this.props
    return (
      <div className='login-providers'>
        <h3>Select a service</h3>
        <ul>
          {
            Object.keys(providers).map((provider) =>
              <li key={provider}>
                <Link to={`/login/${provider}`}>
                  {providers[provider].icon ? <img className='provider-icon' src={providers[provider].icon} /> : null}
                  {providers[provider].name}
                </Link>
              </li>
            )
          }
        </ul>
      </div>
    )
  }
}


class ProviderModal extends PureComponent {
  static propTypes = {
    provider: PropTypes.string.isRequired,
    addTeam: PropTypes.func.isRequired,
    showLogin: PropTypes.func.isRequired
  }

  render() {
    const { provider, addTeam, showLogin } = this.props
    let Provider = null
    if (provider) {
      try {
        Provider = require(`./${provider}/Login.react`)
      } catch (e) {
        console.error(e)
      }
    }

    return Provider ? (
      <Modal isOpen className='modal-login' onRequestClose={showLogin}>
        <Provider addTeam={addTeam} />
      </Modal>
    ) : null
  }
}


export default Login
