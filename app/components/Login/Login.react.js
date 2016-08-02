import React, { Component, PropTypes } from 'react'
import SlackLogin from './Logins/Slack.react'


export default class Login extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  static propTypes = {
    routeParams: PropTypes.object.isRequired,
    provider: PropTypes.shape({ loaded: PropTypes.bool, name: PropTypes.string }),
    providers: PropTypes.array,
    addTeam: PropTypes.func.isRequired
  }

  componentDidMount() {
    this.mounted = true
  }

  componentWillUnmount() {
    this.mounted = false
  }

  _renderTeamLogin() {
    switch (this.props.routeParams.teamType) {
      case 'slack':
        return <SlackLogin addTeam={::this.props.addTeam} />
      default:
        return null
    }
  }

  render() {
    return (
      <div className='login'>
        {::this._renderTeamLogin()}
      </div>
    )
  }
}
