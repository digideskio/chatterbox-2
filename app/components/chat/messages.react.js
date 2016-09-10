import React, { PropTypes, Component } from 'react'
import { connect } from 'react-redux'
import Message, { DaySeparator } from './message'
import { last, get } from 'lodash'

function mapStateToProps({ teams: { teams, activeTeamID }, messages }, { activeChannelorDMID }) {
  const { users } = (teams[activeTeamID] || {})
  return { users, ...get(messages, `${activeTeamID}.${activeChannelorDMID}`, {}) }
}

@connect(mapStateToProps)
export default class Messages extends Component {
  static propTypes = {
    users: PropTypes.object,
    messages: PropTypes.array,
    isLoading: PropTypes.bool
  }

  static defaultProps = {
    isLoading: true,
    messages: [],
    users: {}
  }

  render() {
    const { isLoading, messages, users } = this.props
    return (
      <section className='animation-wrapper'>
        {!isLoading ? messages.map(({key, text, user, timestamp, friendlyTimestamp, ...message}, idx) => {
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
        }) : null}
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
