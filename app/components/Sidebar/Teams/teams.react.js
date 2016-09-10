import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { changeActiveTeam } from 'actions/teams'
import { showLogin } from 'actions/login'
import _ from 'lodash'
import Team from './team.react'

function mapStateToProps({ teams: { teams, activeTeamID } }) {
  return { teams, team: teams[activeTeamID] }
}

@connect(mapStateToProps, { changeActiveTeam, showLogin })
export default class Teams extends Component {
  static propTypes = {
    changeActiveTeam: PropTypes.func.isRequired,
    showLogin: PropTypes.func.isRequired,
    teams: PropTypes.object,
    team: PropTypes.object,
    show: PropTypes.bool
  }

  static defaultProps = {
    teams: [],
    team: {}
  }

  handleProviderClick(id) {
    const { team, changeActiveTeam } = this.props
    if (team.id !== id) {
      changeActiveTeam(id)
    }
  }

  handleLoginClick() {
    this.props.showLogin()
  }

  render() {
    const { team, teams } = this.props

    return (
      <div className='teams'>
        {team.team ? <div className='selected team' style={{backgroundImage: `url(${team.team.image})`}} /> : null}
        {
          Object.keys(teams).map(team => (
            <Team
              key={team}
              onClick={::this.handleProviderClick}
              {..._.get(teams, `${team}.team`, {})}
            />
          ))
        }
        <div className='ion-ios-plus-empty add' onClick={::this.handleLoginClick} title='Add new team' />
      </div>
    )
  }
}
