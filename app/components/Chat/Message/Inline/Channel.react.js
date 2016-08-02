import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as TeamsActions from 'actions/teams'


class InlineChannel extends Component {
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
    return (
      <span onClick={::this.handleClick} className='channel'>
        {this.props.name}
      </span>
    )
  }
}


function mapStateToProps({ settings, teams: { teams, activeTeamID } }) {
  return { settings, team: teams[activeTeamID] }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(TeamsActions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(InlineChannel)
