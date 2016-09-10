import React, { Component, PropTypes } from 'react'
import { changeActiveTeamChannelOrDM } from 'actions/teams'
import { connect } from 'react-redux'
import Dragula from 'react-dragula'
import classnames from 'classnames'
import DM from './dm.react'
import Channel from './channel.react'

function mapStateToProps({ teams: { teams, activeTeamID } }) {
  const { dms, team, user, channels, activeChannelorDMID } = (teams[activeTeamID] || {})
  return { dms, team, user, channels, activeChannelorDMID }
}

@connect(mapStateToProps, { changeActiveTeamChannelOrDM })
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
    channels: {},
    team: {},
    user: {}
  }

  handleChannelorDMClick = (channel_or_dm_id) => this.props.changeActiveTeamChannelOrDM(channel_or_dm_id, this.props.team.id)

  dragulaDecorator = componentBackingInstance => {
    if (componentBackingInstance) {
      const options = {}
      Dragula([componentBackingInstance], options)
    }
  }

  render() {
    if (!this.props.team.id) return null

    return (
      <div className='teamInfo'>
        <div className='team'>
          <div className='name'>{this.props.team.name}</div>
          <div className={classnames('status', this.props.user.presence)} />
          <span className='handle'>{this.props.user.handle}</span>
        </div>
        <div className='channelsContainer'>
          <div className='channels'>
            <div className='title'>
              CHANNELS
              <span>({Object.keys(this.props.channels).length})</span>
            </div>
            <div ref={this.dragulaDecorator}>
              {
                Object.keys(this.props.channels).map(channelID => (
                  <Channel active={this.props.activeChannelorDMID === channelID} onClick={this.handleChannelorDMClick} select={::this.props.changeActiveTeamChannelOrDM} key={channelID} {...this.props.channels[channelID]} />
                ))
              }
            </div>
          </div>
          <div className='dms'>
            <div className='title'>
              DIRECT MESSAGES
              <span>({Object.keys(this.props.dms).length})</span>
            </div>
            <div ref={this.dragulaDecorator}>
              {
                Object.keys(this.props.dms).map(DMID => (
                  <DM active={this.props.activeChannelorDMID === DMID} onClick={this.handleChannelorDMClick} select={::this.props.changeActiveTeamChannelOrDM} key={DMID} {...this.props.dms[DMID]} />
                ))
              }
            </div>
          </div>
        </div>
      </div>
    )
  }
}
