import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import Dragula from 'react-dragula'
import classnames from 'classnames'
import DM from './dm.react'
import Channel from './channel.react'

function mapStateToProps({ teams: { teams, activeTeamID } }) {
  const { dms = {}, team, user, channels = {} } = (teams[activeTeamID] || {})
  return { dms: Object.keys(dms), team, user, channels: Object.keys(channels) }
}

@connect(mapStateToProps)
export default class TeamInfo extends Component {
  static propTypes = {
    channels: PropTypes.array,
    dms: PropTypes.array,
    team: PropTypes.object,
    user: PropTypes.object
  }

  static defaultProps = {
    channels: {},
    team: {},
    user: {}
  }

  dragulaDecorator = componentBackingInstance => {
    if (componentBackingInstance) {
      const options = {}
      Dragula([componentBackingInstance], options)
    }
  }

  render() {
    const { team: { id, name }, user: { handle, presence }, channels, dms } = this.props
    if (!id) return null

    return (
      <div className='teamInfo'>
        <div className='team'>
          <div className='name'>{name}</div>
          <div className={classnames('status', presence)} />
          <span className='handle'>{handle}</span>
        </div>
        <div className='channelsContainer'>
          <div className='channels'>
            <div className='title'>
              CHANNELS
              <span>({Object.keys(channels).length})</span>
            </div>
            <div ref={this.dragulaDecorator}>
              {channels.map(id => <Channel id={id} key={id} />)}
            </div>
          </div>
          <div className='dms'>
            <div className='title'>
              DIRECT MESSAGES
              <span>({Object.keys(dms).length})</span>
            </div>
            <div ref={this.dragulaDecorator}>
              {dms.map(id => <DM id={id} key={id} />)}
            </div>
          </div>
        </div>
      </div>
    )
  }
}
