import React, { Component, PropTypes } from 'react'
import _ from 'lodash'
import Chat from './Chat'
import Sidebar from './Sidebar'


export default class Team extends Component {
  static propTypes = {
    routeParams: PropTypes.object.isRequired,

    editMessage: PropTypes.func.isRequired,
    removeMessage: PropTypes.func.isRequired,
    sendMessage: PropTypes.func.isRequired,

    activeTeamID: PropTypes.string.isRequired,
    teams: PropTypes.object.isRequired,
    changeTeam: PropTypes.func.isRequired,
    removeTeam: PropTypes.func.isRequired,
    changeActiveTeam: PropTypes.func.isRequired,
    changeActiveTeamChannelOrDM: PropTypes.func.isRequired,
    messages: PropTypes.object.isRequired,

    changeSetting: PropTypes.func.isRequired,
    settings: PropTypes.object.isRequired
  }

  componentDidMount() {
    this.mounted = true
  }

  componentWillUnmount() {
    this.mounted = false
  }

  get _team() {
    return _.get(this.props, `teams.${this.props.activeTeamID}`, {})
  }

  get _messages() {
    const { activeChannelorDMID, team } = this._team
    return _.get(this.props, `messages.${team.id}.${activeChannelorDMID}`, [])
  }

  get _currentChannelorDM() {
    const { channels, dms, activeChannelorDMID } = this._team
    return _.get(channels, activeChannelorDMID) || _.get(dms, activeChannelorDMID)
  }

  get _usersOnCurrentChannelorDM() {
    const { channels, dms, activeChannelorDMID } = this._team
    return _.get(channels, `${activeChannelorDMID}.members`) || _.get(dms, `${activeChannelorDMID}.members`)
  }

  render() {
    return (
      <div>
        <Sidebar
          {..._.pick(this.props, ['changeActiveTeam', 'changeActiveTeamChannelOrDM', 'settings', 'changeSetting', 'removeTeam', 'teams'])}
          {..._.pick(this._team, ['channels', 'dms', 'users', 'user', 'team', 'activeChannelorDMID'])}
        />

        <Chat
          {..._.pick(this._team, ['users', 'user', 'team', 'activeChannelorDMID'])}
          channel={this._currentChannelorDM}
          channelUsers={this._usersOnCurrentChannelorDM}
          messages={this._messages}
          sendMessage={::this.props.sendMessage}
        />
      </div>
    )
  }
}
