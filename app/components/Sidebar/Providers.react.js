import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import classnames from 'classnames'
import styles from 'styles/sidebar.css'

export default class Providers extends Component {

  static propTypes = {
    providers: PropTypes.array,
    currentTeam: PropTypes.object
  }

  static defaultProps = {
    currentTeam: {}
  }

  render() {
    return (
      <div className={styles.providers}>
        <div className={styles.selected} style={{backgroundImage: `url(${this.props.currentTeam.image})`}} />
        <div className={styles.bottom}>
          <div className={styles.provider}>
            <div className={styles.new_message} />
            <div className={styles.unread_counter}>4</div>
          </div>
          <div className={styles.provider} />
          <Link to='/login/slack' className={classnames('ion-ios-plus-empty', styles.add)} />
        </div>
      </div>
    )
  }
}
