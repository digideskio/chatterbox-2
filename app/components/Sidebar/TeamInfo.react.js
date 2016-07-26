import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'
import styles from 'styles/sidebar.css'

export default class TeamInfo extends Component {

  static propTypes = {
    channels: PropTypes.array,
    team: PropTypes.object,
    user: PropTypes.object
  }

  static defaultProps = {
    channels: [],
    team: {},
    user: {}
  }

  render() {
    return (
      <div className={styles.teamInfo}>
        <div className={styles.team}>
          <div className={styles.name}>{this.props.team.name}</div>
          <div className={classnames(styles.status, this.props.user.presence)} />
          <span className={styles.handle}>{this.props.user.handle}</span>
        </div>
        <div className={styles.channels}>
          {
            this.props.channels.map(({id, name}) => (
              <Channel key={id} name={name} active={false} missedPings={false} />
            ))
          }
        </div>
      </div>
    )
  }
}


class Channel extends Component {

  static propTypes = {
    active: PropTypes.bool,
    name: PropTypes.string,
    missedPings: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
  }

  render() {
    const { missedPings, active, name } = this.props
    return (
      <div className={classnames(styles.channel, {[styles.active]:active}, {[styles.attention]:missedPings})}>
        <p>{this.props.name}</p>
        {
          missedPings ? <span className={styles.missed_pings}>{missedPings}</span> : null
        }
      </div>
    )
  }
}
