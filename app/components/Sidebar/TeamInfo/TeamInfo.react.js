import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'
import styles from 'styles/sidebar.css'
import DM from './DM.react'
import Channel from './Channel.react'

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
          <div className={classnames(styles.status, styles[this.props.user.presence])} />
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
