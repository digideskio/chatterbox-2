import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'
import styles from 'styles/sidebar.css'

export default class TeamInfo extends Component {

  static propTypes = {
    activeChannelorDMID: PropTypes.string,
    changeActiveTeamChannelOrDM: PropTypes.func,
    channels: PropTypes.object,
    dms: PropTypes.object,
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
          <div className={styles.title}>CHANNELS<span>{this.props.channels.length}</span></div>
          {
            Object.keys(this.props.channels).map(channelID => (
              <Channel active={this.props.activeChannelorDMID === channelID} onClick={this.handleChannelorDMClick} select={::this.props.changeActiveTeamChannelOrDM} key={channelID} {...this.props.channels[channelID]} />
            ))
          }
        </div>
        <div className={styles.dms}>
          <div className={styles.title}>DIRECT MESSAGES<span>{this.props.dms.length}</span></div>
          {
            Object.keys(this.props.dms).map(DMID => (
              <DM active={this.props.activeChannelorDMID === DMID} onClick={this.handleChannelorDMClick} select={::this.props.changeActiveTeamChannelOrDM} key={DMID} {...this.props.dms[DMID]} />
            ))
          }
        </div>
      </div>
    )
  }
}

class DM extends Component {
  static propTypes = {
    id: PropTypes.string,
    image: PropTypes.string,
    handle: PropTypes.string,
    active: PropTypes.bool,
    name: PropTypes.string,
    missedPings: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
    onClick: PropTypes.func.isRequired
  }

  handleOnClick = () => this.props.onClick(this.props.id)

  render() {
    const { image, active, handle } = this.props
    return (
      <div onClick={this.handleOnClick} className={classnames(styles.dm, {[styles.active]: active})}>
        <div className={styles.image} style={{backgroundImage: `url(${image})`}} />
        <div className={styles.name}>{handle}</div>
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
        <p>{name}</p>
        {
          missedPings ? <span className={styles.missed_pings}>{missedPings}</span> : null
        }
      </div>
    )
  }
}
