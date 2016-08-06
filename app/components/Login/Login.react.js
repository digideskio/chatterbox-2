import React, { PropTypes, PureComponent } from 'react'
import { Link } from 'react-router'
import Modal from 'react-modal'


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

  componentWillMount() {
    const { provider } = this.props
    if (provider) {
      try {
        this.Provider = require(`./${provider}/Login.react`)
      } catch (e) {
        console.error(e)
      }
    }
  }

  render() {
    const { props: { addTeam, showLogin }, Provider } = this
    if (!Provider) return null
    return (
      <Modal isOpen className='modal-login' onRequestClose={showLogin}>
        <Provider addTeam={addTeam} />
      </Modal>
    )
  }
}


export default Login
