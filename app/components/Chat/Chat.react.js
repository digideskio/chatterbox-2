import React, { Component, PropTypes } from 'react'
import _ from 'lodash'
import Message, { DaySeparator } from './Message'
import Sender from './Sender.react'
import styles from 'styles/chat.css'

export default class Chat extends Component {
  static propTypes = {
    messages: PropTypes.array,
    users: PropTypes.object,
    channelUsers: PropTypes.array
  }

  static defaultProps = {
    messages: [],
    users: {},
    channelUsers: [],
    channel: {}
  }

  componentDidUpdate({ messages: prevMessages }) {
    const { timestamp: prevTimestamp } = _.last(prevMessages)
    const { timestamp: currentTimestamp } = _.last(this.props.messages)

    console.log(prevTimestamp, currentTimestamp)

    if (prevTimestamp !== currentTimestamp) {
      this._checkMessagesScroll()
    }
  }

  _checkMessagesScroll() {
    const { messagesContainer } = this.refs
    console.log(messagesContainer)
    messagesContainer.scrollTop = messagesContainer.scrollHeight
  }

  _mapUserIDtoData(id, messageIdx) {
    const { userProfile } = this.props.messages[messageIdx]
    if (userProfile) {
      return { name: userProfile.name, image: _.last(_.filter(userProfile, (a, key) => key.includes('image'))) }
    } else {
      const { name, images } = _.get(this.props.users, id, {})
      return { name, image: _.last(images) }
    }
  }

  render() {
    return (
      <div className={styles.chat}>
        <header>
          <div className={styles.info}>
            <span className={styles.channel}>{this.props.channel.name}</span>
            <span className={styles.meta}>{this.props.channelUsers.length} Members</span>
            {
              _.get(this.props, 'channel.meta.topic') ? (
                <div>
                  <span className={styles.spacer}>|</span>
                  <span className={styles.meta}>{this.props.channel.meta.topic}</span>
                </div>
              ) : null
            }
          </div>
        </header>
        <section ref='messagesContainer' className={styles.messages}>
          {
            this.props.messages.map(({text, user, timestamp, friendlyTimestamp, ...message}, idx) => (
              <Message
                key={`${user}-${timestamp}`}
                firstInChain={this.props.messages[idx - 1] && this.props.messages[idx - 1].user !== user}
                user={::this._mapUserIDtoData(user, idx)}
                text={text}
                timestamp={friendlyTimestamp || timestamp}
                {...message}
              />
            ))
          }
        </section>
        <Sender />
      </div>
    )
  }
}
