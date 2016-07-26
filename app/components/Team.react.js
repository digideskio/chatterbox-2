import React, { Component, PropTypes } from 'react'
import _ from 'lodash'
import Chat from './Chat'
import Sidebar from './Sidebar'

export default class Team extends Component {
  static propTypes = {
    routeParams: PropTypes.object.isRequired,

    teams: PropTypes.shape({ activeTeamID: PropTypes.string.isRequired, teams: PropTypes.object.isRequired }),
    changeTeam: PropTypes.func.isRequired,
    removeTeam: PropTypes.func.isRequired,
    changeActiveTeam: PropTypes.func.isRequired,

    changeSetting: PropTypes.func.isRequired,
    settings: PropTypes.object.isRequired,
  }

  componentDidMount() {
    this.mounted = true
  }

  componentWillUnmount() {
    this.mounted = false
  }

  get team() {
    return this.props.teams.teams[this.props.teams.activeTeamID]
  }

  render() {
    console.log(this.team)
    return (
      <div>
        <Sidebar
          {..._.pick(this.props, ['changeActiveTeam', 'settings', 'changeSetting', 'removeTeam'])}
          {..._.pick(this.team, ['channels', 'users', 'team'])}
        />
        <Chat />
      </div>
    )
  }
}
