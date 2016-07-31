import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import classnames from 'classnames'
import { shell } from 'electron'
import styles from 'styles/chat.css'


class InlineLink extends Component {
  static propTypes = {
    url: PropTypes.string,
    label: PropTypes.string
  }

  handleClick() {
    shell.openExternal(this.props.url)
  }

  render() {
    const { url, label } = this.props
    return (
      <div onClick={::this.handleClick} className={styles.link}>{name || label}</div>
    )
  }
}


function mapStateToProps({ settings }) {
  return { settings }
}

export default connect(mapStateToProps)(InlineLink)
