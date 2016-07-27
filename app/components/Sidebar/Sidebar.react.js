import React, { Component, PropTypes } from 'react'
import Providers from './Providers.react'
import TeamInfo from './TeamInfo.react'
import styles from 'styles/sidebar.css'


export default class Sidebar extends Component {
  static propTypes = {
    teams: PropTypes.object.isRequired,
    team: PropTypes.object.isRequired,
    users: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    channels: PropTypes.object.isRequired
  }

  render() {
    return (
      <div className={styles.sidebar}>
        <div className={styles.selected}/>
        <Providers
          {..._.pick(this.props, ['changeActiveTeam', 'teams'])}
          currentTeam={this.props.team}
        />
        <TeamInfo {...this.props} />
      </div>
    )
  }
}
