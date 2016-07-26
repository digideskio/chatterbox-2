import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'
import styles from 'styles/sidebar.css'

export default class TeamInfo extends Component {

  static propTypes = {
    channels: PropTypes.array.isRequired,
    username: PropTypes.string,
    name: PropTypes.string,
  }

  render() {
    console.log(this.props)
    return (
      <div className={styles.teamInfo}>
        <div className={styles.team}>
          <div className={styles.name}>Magics™</div>
          <div className={classnames(styles.status, styles.online)} />
          <span className={styles.handle}>luigiplr</span>
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
