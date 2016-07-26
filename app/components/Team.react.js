import React, { Component, PropTypes } from 'react'
import _ from 'lodash'
import Chat from './Chat'
import Sidebar from './Sidebar'

export default class Team extends Component {
  static propTypes = {
    routeParams: PropTypes.object.isRequired,

    activeTeamID: PropTypes.string.isRequired,
    teams: PropTypes.object.isRequired,
    changeTeam: PropTypes.func.isRequired,
    removeTeam: PropTypes.func.isRequired,
    changeActiveTeam: PropTypes.func.isRequired,

    changeSetting: PropTypes.func.isRequired,
    settings: PropTypes.object.isRequired,
  }

  static defaultProps = {
    teams: {}
  }

  componentDidMount() {
    this.mounted = true
  }

  componentWillUnmount() {
    this.mounted = false
  }

  get _team() {
    return this.props.teams[this.props.activeTeamID]
  }

  get _messages() {
    if (!this._team) return []
    const { messages, activeChannelorDMID } = this._team
    return messages[activeChannelorDMID]
  }

  get _usersOnCurrentChannelorDM() {
    if (!this._team) return []
    const { channels, dms, activeChannelorDMID } = this._team

    if (channels[activeChannelorDMID]) {
      return channels[activeChannelorDMID].members
    } else if (dms[activeChannelorDMID]) {
      return dms[activeChannelorDMID].members
    } else {
      return []
    }
  }

  render() {
    console.log(this._team)
    return (
      <div>
        <Sidebar
          {..._.pick(this.props, ['changeActiveTeam', 'settings', 'changeSetting', 'removeTeam'])}
          {..._.pick(this._team, ['channels', 'users', 'user', 'team'])}
        />
        <Chat
          {..._.pick(this._team, ['users', 'user', 'team'])}
          channelUsers={this._usersOnCurrentChannelorDM}
          messages={this._messages}
        />

      </div>
    )
  }
}
