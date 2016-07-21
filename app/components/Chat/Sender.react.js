import React, { Component, PropTypes } from 'react'
import styles from 'styles/chat.css'

export default class Sender extends Component {
  render() {
    return (
      <div className={styles.sender}>
        <input type='text' placeholder='Type something...' className={styles['text-input']} />
      </div>
    )
  }
}
