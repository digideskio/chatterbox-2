import React, { Component, PropTypes } from 'react'
import {pick} from 'lodash'
import Providers from './Providers.react'
import TeamInfo from './TeamInfo'

export default class Sidebar extends Component {
  static propTypes = {
    teams: PropTypes.object,
    team: PropTypes.object,
    users: PropTypes.object,
    user: PropTypes.object,
    channels: PropTypes.object
  }

  render() {
    return (
      <div className='app-sidebar'>
        <div className='selected' />
        <Providers
          {...pick(this.props, ['changeActiveTeam', 'teams'])}
          currentTeam={this.props.team}
        />
        <TeamInfo {...this.props} />
      </div>
    )
  }
}
