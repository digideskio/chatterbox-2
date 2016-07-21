import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'
import styles from 'styles/sidebar.css'

export default class Providers extends Component {

  static propTypes = {
    providers: PropTypes.array,
    selected: PropTypes.object
  }

  render() {
    return (
      <div className={styles.providers}>
        <div className={styles.selected} />
        <div className={styles.bottom}>
          <div className={styles.provider}>
            <div className={styles.new_message} />
            <div className={styles.unread_counter}>4</div>
          </div>
          <div className={styles.provider} />
          <i className={classnames('ion-ios-plus-empty', styles.add)} />
        </div>
      </div>
    )
  }
}
