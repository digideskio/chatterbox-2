import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'
import styles from 'styles/sidebar.css'

export default class DM extends Component {
  static propTypes = {
    id: PropTypes.string,
    image: PropTypes.string,
    handle: PropTypes.string,
    active: PropTypes.bool,
    name: PropTypes.string,
    missedPings: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
    onClick: PropTypes.func.isRequired
  }

  handleOnClick = () => this.props.onClick(this.props.id)

  render() {
    const { image, active, handle } = this.props
    return (
      <div onClick={this.handleOnClick} className={classnames(styles.dm, {[styles.active]: active})}>
        <div className={styles.image} style={{backgroundImage: `url(${image})`}} />
        <div className={styles.name}>{handle}</div>
      </div>
    )
  }
}
