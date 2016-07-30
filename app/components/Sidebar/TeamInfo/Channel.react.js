import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'
import styles from 'styles/sidebar.css'



export default class Channel extends Component {
  static propTypes = {
    id: PropTypes.string,
    active: PropTypes.bool,
    name: PropTypes.string,
    missedPings: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
    onClick: PropTypes.func.isRequired
  }

  handleOnClick = () => this.props.onClick(this.props.id)

  render() {
    const { missedPings, active, name } = this.props
    return (
      <div onClick={this.handleOnClick} className={classnames(styles.channel, {[styles.active]: active}, {[styles.attention]: missedPings})}>
        <p>{name}</p>
        {
          missedPings ? <span className={styles.missed_pings}>{missedPings}</span> : null
        }
      </div>
    )
  }
}
