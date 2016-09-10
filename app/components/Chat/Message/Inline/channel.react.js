import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import * as TeamsActions from 'actions/teams'

function mapStateToProps({ settings, teams: { teams, activeTeamID } }) {
  return { settings, team: teams[activeTeamID] }
}

@connect(mapStateToProps, TeamsActions)
export default class InlineChannel extends Component {
  static propTypes = {
    name: PropTypes.string,
    id: PropTypes.string,
    changeActiveTeamChannelOrDM: PropTypes.func.isRequired,
    team: PropTypes.object.isRequired
  }

  handleClick() {
    const { changeActiveTeamChannelOrDM, id: channelID, team: { team: { id: teamID } } } = this.props
    changeActiveTeamChannelOrDM(channelID, teamID)
  }

  render() {
    const { name } = this.props
    return (
      <span onClick={::this.handleClick} className='channel'>
        {name}
      </span>
    )
  }
}
