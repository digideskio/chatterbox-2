import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'
import url from 'url'
import qs from 'qs'
import { shell } from 'electron'
import needle from 'needle'
//import SlackTeamhandler from 'lib/handlers/slack'
import styles from 'styles/login.css'


export default class SlackLogin extends Component {

  state = {
    webviewShown: false
  }

  componentDidMount() {
    this.mounted = true
    this._initWebviewEvents()
  }

  componentWillUnmount() {
    this.mounted = false
  }

  client_id = '8772351907.62016425399'
  client_secret = '240c89a8e4b306e7455c7f1b78e63f66'
  redirect_uri = 'http://localhost'

  _initWebviewEvents() {
    const { webview } = this.refs

    webview.addEventListener('dom-ready', () => {
      if (!this.mounted) return
      webview.insertCSS(require('!raw!styles/webview_overrides/slack.css'))
      if (!this.state.webviewShown)
        this.setState({ webviewShown: true })
    })

    webview.addEventListener('will-navigate', (event) => {
      if (!this.mounted) return
      if (event.url.endsWith('/forgot')) {
        shell.openExternal(event.url)
        webview.stop()
      }
      if (event.url.startsWith('http://localhost')) {
        const { code } = qs.parse(url.parse(event.url).query)
        webview.stop()

        needle.post('https://slack.com/api/oauth.access', {
          client_secret: this.client_secret,
          client_id: this.client_id,
          code,
          redirect_uri: this.redirect_uri
        }, (err, res, body) => {
          console.log(body)
        })
      }
    })
  }

  get oAuthQuery() {
    return qs.stringify({
      client_id: this.client_id,
      scope: [
        'team:read',
        'channels:history', 'channels:read',
        'im:history', 'im:read', 'im:write',
        'chat:write:user',
        'users:read', 'users:write', 'users.profile:read'
      ].join(','),
      redirect_uri: this.redirect_uri,
      repick: 1
    })
  }

  render() {
    const { webviewShown } = this.state
    return (
      <div className={styles.login}>
        <div className={classnames(styles.sidebar, styles.full)}>
          <object className={styles.slack} data='images/logins/slack.svg' type='image/svg+xml'/>
        </div>
        <div className={classnames(styles.webview, {[styles.show]: webviewShown})}>
          <webview ref='webview' src={`https://slack.com/oauth/pick_reflow?${this.oAuthQuery}`}/>
        </div>
      </div>
    )
  }
}
