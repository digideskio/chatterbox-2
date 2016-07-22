import React, { Component, PropTypes } from 'react'
import styles from 'styles/login.css'
import SlackLogin from './Logins/Slack.react'


export default class Login extends Component {
  static propTypes = {
    routeParams: PropTypes.object.isRequired
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
        return <SlackLogin />
      default:
        return <div />
    }
  }

  render() {
    return (
      <div className={styles.login}>
        {::this._renderTeamLogin()}
      </div>
    )
  }
}
