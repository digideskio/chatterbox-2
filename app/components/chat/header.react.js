import React, { PropTypes, PureComponent } from 'react'
import { connect } from 'react-redux'
import { isArray, get } from 'lodash'

function mapStateToProps({ teams: { teams, activeTeamID } }, { activeChannelorDMID }) {
  const { channels, dms } = teams[activeTeamID]
  const { members, meta, name } = (channels[activeChannelorDMID] || dms[activeChannelorDMID])
  return {
    meta,
    members,
    name
  }
}

@connect(mapStateToProps)
export default class Header extends PureComponent {
  static propTypes = {
    name: PropTypes.string,
    members: PropTypes.any,
    meta: PropTypes.object
  }

  get channelMeta() {
    const { members, meta = {} } = get(this.props, 'channel', {})
    let channelMeta = []
    if (members) {
      channelMeta.push(
        <span className='meta' key='members'>
          {isArray(members) ? members.length : members} Members
        </span>
      )
    }

    if (meta.topic) {
      channelMeta.push(
        <div key='topic'>
          <span className='spacer'>|</span>
          <span className='meta'>{meta.topic}</span>
        </div>
      )
    }

    return channelMeta
  }

  render() {
    const { name } = this.props
    return (
      <header>
        <div className='info'>
          <span className='channel'>{name}</span>
          {this.channelMeta}
        </div>
      </header>
    )
  }
}
