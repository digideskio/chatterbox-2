import React, { Component, PropTypes } from 'react'
import _ from 'lodash'
import { Link } from 'react-router'
import Provider from './Provider.react'

export default class Providers extends Component {
  static propTypes = {
    changeActiveTeam: PropTypes.func.isRequired,
    teams: PropTypes.object,
    currentTeam: PropTypes.object
  }

  static defaultProps = {
    teams: [],
    currentTeam: {}
  }

  handleProviderClick(id) {
    if (this.props.currentTeam.id !== id) {
      this.props.changeActiveTeam(id)
    }
  }

  render() {
    return (
      <div className='teams'>
        <div className='selected' style={{backgroundImage: `url(${this.props.currentTeam.image})`}} />
        <div className='bottom'>
          {
            Object.keys(this.props.teams).map(team => (
              <Provider
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
