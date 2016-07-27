import React, { Component, PropTypes } from 'react'
import _ from 'lodash'
import classnames from 'classnames'
import Attachments from './Attachments.react'
import styles from 'styles/chat.css'

export default class Message extends Component {
  static propTypes = {
    attachments: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]),
    text: PropTypes.string,
    timestamp: PropTypes.string,
    firstInChain: PropTypes.bool,
    user: PropTypes.shape({ image: PropTypes.string, name: PropTypes.string })
  }

  render() {
    const { timestamp, user, text, attachments, firstInChain } = this.props
    return (
      <div className={classnames(styles.message, {[styles.firstInChain]:firstInChain})}>
        <div className={styles.aside}>
          {
            firstInChain ? (
              <div style={{backgroundImage: `url(${user.image})`}} className={styles.profile_pic} />
            ) : (
              <span className={styles.time}>{timestamp}</span>
            )
          }
        </div>
        <div className={styles.body}>
          {
            firstInChain ? (
              <div className={styles.info}>
                <span className={styles.user}>{user.name}</span>
                <span className={styles.time}>{timestamp}</span>
              </div>
            ) : null
          }
          {
            text ? (
              <div className={styles.message_text}>{text}</div>
            ) : null
          }
          {
            attachments && attachments.length > 0 ? (
              <Attachments attachments={attachments} />
            ) : null
          }
        </div>
      </div>
    )
  }
}

export class DaySeparator extends Component {
  static propTypes = {
    timestamp: PropTypes.string.isRequired,
  }

  render() {
    return (
      <div className={styles.day_separator}>
        <div/>
        <span>{this.props.timestamp}</span>
        <div/>
      </div>
    )
  }
}
