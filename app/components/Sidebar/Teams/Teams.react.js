import React, { Component, PropTypes } from 'react'
import _ from 'lodash'
import Team from './Team.react'

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
    if (this.props.team.id !== id) {
      this.props.changeActiveTeam(id)
    }
  }

  handleLoginClick() {
    this.props.showLogin()
  }

  render() {
    if (!this.props.show) return null

    return (
      <div className='teams'>
        {this.props.team.team ? <div className='selected team' style={{backgroundImage: `url(${this.props.team.team.image})`}} /> : null}
        {
          Object.keys(this.props.teams).map(team => (
            <Team
              key={team}
              onClick={::this.handleProviderClick}
              {..._.get(this.props.teams, `${team}.team`, {})}
            />
          ))
        }
        <div className='ion-ios-plus-empty add' onClick={::this.handleLoginClick} />
      </div>
    )
  }
}
