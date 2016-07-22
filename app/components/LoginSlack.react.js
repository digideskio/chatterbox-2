import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'
import styles from 'styles/login.css'


export default class Login extends Component {

  state = {
    webviewShown: false
  }

  componentDidMount() {
    this.mounted = true
    const { webview } = this.refs
    webview.addEventListener('dom-ready', () => {
      if (!this.mounted) return
      webview.insertCSS(require('!raw!styles/webview_overrides/slack.css'))
      webview.openDevTools()
      setTimeout(() => this.setState({ webviewShown: true }), 500)
    })
  }

  componentWillUnmount() {
    this.mounted = false
  }

  render() {
    return (
      <div className={styles.login}>
        <div className={styles.sidebar}>
        </div>
        <div className={classnames(styles.webview, {[styles.show]: this.state.webviewShown})}>
          <webview ref='webview' src='https://slack.com/oauth/pick_reflow?client_id=8772351907.62016425399&scope=channels%3Aread&redirect_uri=http%3A%2F%2Flocalhost'/>
        </div>
      </div>
    )
  }
}
