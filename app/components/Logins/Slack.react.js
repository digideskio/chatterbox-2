import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'
import { shell } from 'electron'
import styles from 'styles/login.css'


export default class SlackLogin extends Component {

  state = {
    webviewShown: false
  }

  componentDidMount() {
    this.mounted = true
    const { webview } = this.refs

    webview.addEventListener('dom-ready', () => {
      if (!this.mounted) return
      webview.insertCSS(require('!raw!styles/webview_overrides/slack.css'))
        //setTimeout(() => this.setState({ webviewShown: true }), 500)
    })

    webview.addEventListener('will-navigate', (event) => {
      if (!this.mounted) return
      console.log(event)
      if (event.url.endsWith('/forgot')) {
        shell.openExternal(event.url)
        webview.stop()
      }
    })
  }

  componentWillUnmount() {
    this.mounted = false
  }

  render() {
    const { webviewShown } = this.state
    return (
      <div className={styles.login}>
        <div className={classnames(styles.sidebar, styles.full)}>
          <object className={styles.slack} data='images/logins/slack.svg' type='image/svg+xml'/>
        </div>
        <div className={classnames(styles.webview, {[styles.show]: this.state.webviewShown})}>
          <webview ref='webview' src='https://slack.com/oauth/pick_reflow?client_id=8772351907.62016425399&scope=channels%3Aread&redirect_uri=http%3A%2F%2Flocalhost'/>
        </div>
      </div>
    )
  }
}
