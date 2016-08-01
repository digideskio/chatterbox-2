import React, { Component, PropTypes } from 'react'
import _ from 'lodash'
import { Link } from 'react-router'
import classnames from 'classnames'

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
              <Provider key={team} onClick={::this.handleProviderClick} {..._.get(this.props.teams, `${team}.team`, {})} />
            ))
          }
          <Link to='/login/slack' className={classnames('ion-ios-plus-empty', 'add')} />
        </div>
      </div>
    )
  }
}

class Provider extends Component {

  static propTypes = {
    image: PropTypes.string,
    unreads: PropTypes.bool,
    pings: PropTypes.number,
    id: PropTypes.string,
    onClick: PropTypes.func.isRequired
  }

  static defaultProps = {
    currentTeam: {}
  }

  handleClick = () => this.props.onClick(this.props.id)

  render() {
    return (
      <div onClick={this.handleClick} className='team' style={{backgroundImage: `url(${this.props.image})`}}>
        {
          this.props.unreads ? <div className='new_message' /> : null
        }
        {
          this.props.pings ? <div className='unread_counter'>{this.props.pings}</div> : null
        }
      </div>
    )
  }
}
