import React, { Component, PropTypes } from 'react'
import Providers from './Providers.react'
import TeamInfo from './TeamInfo'
import styles from 'styles/sidebar.css'


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
