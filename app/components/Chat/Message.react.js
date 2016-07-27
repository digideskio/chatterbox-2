import React, { Component, PropTypes } from 'react'
import _ from 'lodash'
import styles from 'styles/chat.css'

export default class Message extends Component {
  static propTypes = {
    attachments: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]),
    text: PropTypes.string,
    timestamp: PropTypes.string,
    firstInChain: PropTypes.bool,
    user: PropTypes.shape({ image: PropTypes.string, name: PropTypes.string })
  }

  _renderAttchments(attachments) {
    return attachments.map(({ pretext, text, color }, idx) => {
      return (
        <div key={idx + 1} className={styles.attachment}>
          <div className={styles.pretext}>{pretext}</div>
          <div className={styles.textHolder}>
            <div className={styles.sidebar} style={{backgroundColor: color}} />
            <div className={styles.text}>{text}</div>
          </div>
        </div>
      )
      return false
    }).filter(Boolean)
  }

  render() {
    const { timestamp, user, text, attachments, firstInChain } = this.props

    return (
      <div className={styles.message}>
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
              <div className={styles.attachments}>
                {this._renderAttchments(attachments)}
              </div>
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
