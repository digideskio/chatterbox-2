import React, { PropTypes, PureComponent } from 'react'
import { isArray, get } from 'lodash'

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
    return (
      <header>
        <div className='info'>
          <span className='channel'>{this.props.name}</span>
          {this.channelMeta}
        </div>
      </header>
    )
  }
}
