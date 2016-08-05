import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'
import url from 'url'
import _ from 'lodash'
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

  client_id = 'd0bc81a48deb2e042b7636d85fc3264c86e45ba8'
  client_secret = '380be3e53c0535fdb4e5c63ea7fad283afe0bd38'
  redirect_uri = 'http://localhost'

  _initWebviewEvents() {
    const { webview } = this.refs

    webview.addEventListener('dom-ready', () => {
      if (!this.mounted) return

      webview.insertCSS(require('!raw!styles/webview_overrides/gitter.scss'))
        // webview.openDevTools()

      if (!this.state.webviewShown) {
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
        request.post('https://gitter.im/login/oauth/token', {
          form: {
            code,
            grant_type: 'authorization_code',
            ..._.pick(this, ['client_secret', 'client_id', 'redirect_uri'])
          },
          json: true
        }, (err, res, { access_token: token, token_type }) => {
          if (err) console.error(err)
          this.props.addTeam('gitter', { token })
        })
      }
    })
  }

  getOAuthQuery() {
    return qs.stringify({
      client_id: this.client_id,
      response_type: 'code',
      redirect_uri: this.redirect_uri
    })
  }

  render() {
    const { webviewShown } = this.state
    return (
      <div className='slack'>
        <div className='webview-container'>
          <webview
            className={classnames('webview', {show: webviewShown})}
            ref='webview'
            src={`https://gitter.im/login/oauth/authorize?${::this.getOAuthQuery()}`}
          />
        </div>
      </div>
    )
  }
}
