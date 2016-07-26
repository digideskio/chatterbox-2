import React, { Component, PropTypes } from 'react'
import Message, { DaySeparator } from './Message.react'
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
    channelUsers: []
  }

  _mapUserIDtoData(id) {
    const { name, images } = this.props.users[id]
    return { name, image: images[0] }
  }

  render() {
    console.log(this.props)
    return (
      <div className={styles.chat}>
        <header>
          <div className={styles.info}>
            <span className={styles.channel}>#general</span>
            <span className={styles.meta}>43 Members</span>
            <span className={styles.spacer}>|</span>
            <span className={styles.meta}>Welcome to Magics, We make cool things.</span>
          </div>
        </header>
        <section className={styles.messages}>
          {
            this.props.messages.map(({text, user, timestamp, friendlyTimestamp}) => (
              <Message
                user={::this._mapUserIDtoData(user)}
                text={text}
                timestamp={friendlyTimestamp || timestamp.toString()}
              />
            ))
          }
          <DaySeparator timestamp='June 12' />
        </section>
        <Sender />
      </div>
    )
  }
}
