import React, { PropTypes, PureComponent } from 'react'
import { connect } from 'react-redux'
import Message, { DaySeparator } from './message'
import { isArray, last } from 'lodash'

function mapStateToProps({ settings, teams: { teams, activeTeamID }, messages: allMessages }, { activeChannelorDMID }) {
  const { users, user, channels, dms, team } = (teams[activeTeamID] || {})
  const { members, meta } = (channels[activeChannelorDMID] || dms[activeChannelorDMID])
  const { messages = [], isLoading, lastMessageHash } = allMessages[activeTeamID][activeChannelorDMID]
  return {
    settings,
    users,
    meta,
    members,
    user,
    messages,
    team,
    isLoading,
    lastMessageHash
  }
}

@connect(mapStateToProps)
export default class Messages extends PureComponent {
  static propTypes = {

  }

  get channelMeta() {
    const { members, meta } = this.props
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
    const { messages, users } = this.props
    return (
      <section ref='messagesContainer' className='animation-wrapper'>
        {
          messages.map(({key, text, user, timestamp, friendlyTimestamp, ...message}, idx) => {
            const {user: prevUser, timestamp: prevTimestamp} = messages[idx - 1] || {}
            const firstInChain = prevUser !== user
            const messageEl = (
              <Message
                key={key}
                firstInChain={firstInChain}
                user={mapUserIDtoData(user, idx, messages, users)}
                text={text}
                timestamp={friendlyTimestamp || timestamp}
                {...message}
              />
            )
            return (!prevTimestamp || new Date(Number(prevTimestamp)).getDay() !== new Date(Number(timestamp)).getDay()) ? (
              <div>
                <DaySeparator key={timestamp} timestamp={Number(timestamp)} />
                {messageEl}
              </div>
            ) : messageEl
          })
        }
      </section>
    )
  }
}


function mapUserIDtoData(id, messageIdx, messages, users) {
  if (messages[messageIdx].userProfile) {
    const { handle, name, image } = messages[messageIdx].userProfile
    return { handle, name, image }
  } else {
    const { name, handle, images } = users[id]
    return { name, handle, image: last(images) }
  }
}
