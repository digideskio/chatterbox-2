import React, { Component, PropTypes } from 'react'
import _ from 'lodash'
import { Link } from 'react-router'
import Team from './Team.react'

export default class Providers extends Component {
  static propTypes = {
    changeActiveTeam: PropTypes.func.isRequired,
    teams: PropTypes.object,
    team: PropTypes.object
  }

  static defaultProps = {
    teams: [],
    currentTeam: {}
  }

  handleProviderClick(id) {
    if (this.props.team.id !== id) {
      this.props.changeActiveTeam(id)
    }
  }

  render() {
    return (
      <div className='teams'>
        <div className='selected' style={{backgroundImage: `url(${this.props.team.image})`}} />
        <div className='bottom'>
          {
            Object.keys(this.props.teams).map(team => (
              <Team
                key={team}
                onClick={::this.handleProviderClick}
                {..._.get(this.props.teams, `${team}.team`, {})}
              />
            ))
          }
          <Link to='/login/slack' className='ion-ios-plus-empty add' />
        </div>
      </div>
    )
  }
}
