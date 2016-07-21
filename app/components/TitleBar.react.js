import React, { Component, PropTypes } from 'react'
import { platform } from 'os'
import { remote } from 'electron'
import styles from 'styles/titlebar.css'

const { TitleBar } = platform() === 'win32' ? require('react-desktop/windows') : require('react-desktop/macOS')


export default class TitleBarComponent extends Component {
  static propTypes = {
    isMaximized: PropTypes.bool.isRequired,
    isMinimized: PropTypes.bool.isRequired,
    toggleMaximize: PropTypes.func.isRequired
  }

  _toggleMaximize() {
    this.props.toggleMaximize(!this.props.isMaximized)
  }

  _minimize() {
    this.props.toggleMinimize(true)
  }

  componentDidMount() {
    const CurrentWindow = remote.getCurrentWindow()
    CurrentWindow.on('restore', () => this.props.toggleMinimize(false, true))
  }

  render() {
    const osProps = platform() === 'darwin' ? { transparent: true } : {}
    return (
      <div onDoubleClick={::this._toggleMaximize} className={styles.titlebar}>
        <TitleBar
          title=' '
          controls
          onMinimizeClick={::this._minimize}
          onRestoreDownClick={::this._toggleMaximize}
          onMaximizeClick={::this._toggleMaximize}
          isMaximized={this.props.isMaximized}
          {...osProps}
          theme='light'
          background='transparent'
        />
      </div>
    )
  }
}
