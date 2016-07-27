import React, { Component, PropTypes } from 'react'
import _ from 'lodash'
import styles from 'styles/chat.css'

export default class Attachments extends Component {
  static propTypes = {
    attachments: PropTypes.array.isRequired
  }

  _renderImage(imageURL) {

  }

  render() {
    return (
      <div className={styles.attachments}>
        {
          this.props.attachments.map(({ pretext, text, color }, idx) => (
            <div key={idx + 1} className={styles.attachment}>
              <div className={styles.pretext}>{pretext}</div>
              <div className={styles.textHolder}>
                <div className={styles.sidebar} style={{backgroundColor: color}} />
                <div className={styles.text}>{text}</div>
              </div>
            </div>
          ))
        }
      </div>
    )
  }
}
