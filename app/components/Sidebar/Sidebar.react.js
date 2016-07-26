import React, { Component, PropTypes } from 'react'
import Providers from './Providers.react'
import TeamInfo from './TeamInfo.react'
import styles from 'styles/sidebar.css'


export default class Sidebar extends Component {
  static propTypes = {
    users: PropTypes.array.isRequired,
    channels: PropTypes.array.isRequired
  }

  render() {
    return (
      <div className={styles.sidebar}>
        <div className={styles.selected}/>
        <Providers />
        <TeamInfo
          channels={this.props.channels}
          users={this.props.users}
        />
      </div>
    )
  }
}
