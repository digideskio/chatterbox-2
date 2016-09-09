import React, { PropTypes, PureComponent } from 'react'
import { connect } from 'react-redux'
import Message, { DaySeparator } from './message'
import { last } from 'lodash'

function mapStateToProps({ teams: { teams, activeTeamID }, messages }, { activeChannelorDMID }) {
  const { users } = (teams[activeTeamID] || {})
  return { users, messages: messages[activeTeamID][activeChannelorDMID] }
}

@connect(mapStateToProps)
export default class Messages extends PureComponent {
  static propTypes = {
    users: PropTypes.array.isRequired,
    messages: PropTypes.array
  }

  static defaultProps = {
    messages: []
  }

  render() {
    const { messages, users } = this.props
    return (
      <section className='animation-wrapper'>
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
