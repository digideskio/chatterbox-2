import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'
import url from 'url'
import qs from 'qs'
import { shell } from 'electron'
import request from 'request'


export default class GitterLogin extends Component {
  static propTypes = {
    addTeam: PropTypes.func.isRequired
  }

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
    let [checked, checking] = []

    webview.addEventListener('ipc-message', ({ channel, args }) => {
      if (!this.mounted) return

      if (channel === 'repick-needed' && !checked) {
        const [repickNeeded] = args
        if (repickNeeded) {
          webview.loadURL(`https://slack.com/oauth/pick_reflow?${::this.getOAuthQuery(1)}`)
        } else {
          this.setState({ webviewShown: true })
        }
        checked = true
      }
    })

    webview.addEventListener('dom-ready', () => {
      if (!this.mounted) return

      webview.insertCSS(require('!raw!styles/webview_overrides/slack.css'))
        // webview.openDevTools()

      if (!checking) {
        checking = true
        webview.getWebContents().send('check-repick')
      }

      if (!this.state.webviewShown && checked) {
        this.setState({ webviewShown: true })
      }
    })

    webview.addEventListener('will-navigate', (event) => {
      if (!this.mounted) return

      if (event.url.endsWith('/forgot')) {
        webview.stop()
        shell.openExternal(event.url)
      }
      if (event.url.startsWith('http://localhost')) {
        const { code } = qs.parse(url.parse(event.url).query)
        webview.stop()
        request.post('https://slack.com/api/oauth.access', {
          form: { client_secret: this.client_secret, client_id: this.client_id, code, redirect_uri: this.redirect_uri },
          json: true
        }, (err, res, { access_token: token }) => {
          if (err) console.error(err)
          this.props.addTeam('slack', { token })
        })
      }
    })
  }

  getOAuthQuery(repick = 0) {
    return qs.stringify({
      client_id: this.client_id,
      scope: 'client',
      redirect_uri: this.redirect_uri,
      repick
    })
  }

  render() {
    const { webviewShown } = this.state
    return (
      <div className='slack'>
        <div className='webview-container'>
          <webview
            className={classnames('webview', {show: webviewShown})}
            preload='components/Logins/Slack/webview.injected.js'
            ref='webview'
            src={`https://slack.com/oauth/pick_reflow?${::this.getOAuthQuery()}`}
          />
        </div>
      </div>
    )
  }
}

/*
<webview
  className={classnames('webview', {show: webviewShown})}
  preload='components/Logins/Slack/webview.injected.js'
  ref='webview'
  src={`https://slack.com/oauth/pick_reflow?${::this.getOAuthQuery()}`}
/> */
