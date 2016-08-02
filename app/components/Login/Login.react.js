import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import SlackLogin from './Slack'

export default class Login extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  static propTypes = {
    routeParams: PropTypes.object.isRequired,
    provider: PropTypes.shape({ loaded: PropTypes.bool, name: PropTypes.string }),
    providers: PropTypes.array,
    addTeam: PropTypes.func.isRequired,
    teams: PropTypes.shape({ teams: PropTypes.object.isRequired })
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
    const { teams: { teams } } = this.props
    return (
      <div className='login'>
        {Object.keys(teams.teams).length > 0 ? <Link to='/chat' className='ion-android-arrow-back back' /> : null}
        {::this._renderTeamLogin()}
      </div>
    )
  }
}
