import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'
import styles from 'styles/sidebar.css'

export default class TeamInfo extends Component {

  static propTypes = {
    changeActiveTeamChannelOrDM: PropTypes.func,
    channels: PropTypes.object,
    team: PropTypes.object,
    user: PropTypes.object
  }

  static defaultProps = {
    channels: [],
    team: {},
    user: {}
  }

  handleChannelorDMClick = (channel_or_dm_id) => this.props.changeActiveTeamChannelOrDM(channel_or_dm_id, this.props.team.id)

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
            Object.keys(this.props.channels).map(channelID => (
              <Channel onClick={this.handleChannelorDMClick} select={::this.props.changeActiveTeamChannelOrDM} key={channelID} id={channelID} {...this.props.channels[channelID]} />
            ))
          }
        </div>
      </div>
    )
  }
}


class Channel extends Component {
  static propTypes = {
    id: PropTypes.string,
    active: PropTypes.bool,
    name: PropTypes.string,
    missedPings: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
    onClick: PropTypes.func.isRequired
  }

  handleOnClick = () => this.props.onClick(this.props.id)

  render() {
    const { missedPings, active, name } = this.props
    return (
      <div onClick={this.handleOnClick} className={classnames(styles.channel, {[styles.active]:active}, {[styles.attention]:missedPings})}>
        <p>{this.props.name}</p>
        {
          missedPings ? <span className={styles.missed_pings}>{missedPings}</span> : null
        }
      </div>
    )
  }
}
