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
    return _.get(this.props, `teams.${this.props.activeTeamID}`, {})
  }

  get _messages() {
    const { messages, activeChannelorDMID } = (this._team || {})
    return _.get(messages, activeChannelorDMID, [])
  }

  get _currentChannelorDM() {
    const { channels, dms, activeChannelorDMID } = (this._team || {})
    return _.get(channels, activeChannelorDMID) || _.get(dms, activeChannelorDMID)
  }

  get _usersOnCurrentChannelorDM() {
    const { channels, dms, activeChannelorDMID } = (this._team || {})
    return _.get(channels, `${activeChannelorDMID}.members`) || _.get(dms, `${activeChannelorDMID}.members`)
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
          channel={this._currentChannelorDM}
          channelUsers={this._usersOnCurrentChannelorDM}
          messages={this._messages}
        />
      </div>
    )
  }
}
