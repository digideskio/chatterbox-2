import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import classnames from 'classnames'
import styles from 'styles/sidebar.css'

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
    console.log(this.props)
    return (
      <div className={styles.providers}>
        <div className={styles.selected} style={{backgroundImage: `url(${this.props.currentTeam.image})`}} />
        <div className={styles.bottom}>
          {
            Object.keys(this.props.teams).map(team => (
              <Provider key={team} onClick={::this.handleProviderClick} {..._.get(this.props.teams, `${team}.team`, {})} />
            ))
          }
          <Link to='/login/slack' className={classnames('ion-ios-plus-empty', styles.add)} />
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
    id: PropTypes.string
  }

  static defaultProps = {
    currentTeam: {}
  }

  handleClick = () => this.props.onClick(this.props.id)

  render() {
    return (
      <div onClick={this.handleClick} className={styles.provider} style={{backgroundImage: `url(${this.props.image})`}}>
        {
          this.props.unreads ? <div className={styles.new_message} /> : null
        }
        {
          this.props.pings ? <div className={styles.unread_counter}>{this.props.pings}</div> :  null
        }
      </div>
    )
  }
}
