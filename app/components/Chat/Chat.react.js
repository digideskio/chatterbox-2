import React, { Component, PropTypes } from 'react'
import Message, { DaySeparator } from './Message.react'
import Sender from './Sender.react'
import styles from 'styles/chat.css'

export default class Chat extends Component {
  static propTypes = {}

  render() {
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
          <DaySeparator timestamp='June 12' />
          <Message
            user={{name: 'luigiplr', avatar: 'https://avatars.slack-edge.com/2016-02-10/20910217602_0d43ac764daac4f67918_48.jpg'}}
            text='pizzatime is here again.'
            timestamp='12:00 PM'
          />
        </section>
        <Sender />
      </div>
    )
  }
}
