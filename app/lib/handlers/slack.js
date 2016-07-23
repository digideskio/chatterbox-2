import { EventEmitter } from 'events'
import { RtmClient, MemoryDataStore, CLIENT_EVENTS, RTM_EVENTS } from '@slack/client'

/**
 * Slack  Team connection handler
 * @param {object} connectionConfig - A valid connection config
 * @param {object} connectionConfig.token - Slack bot connection token
 * @param {object} connectionConfig.options - Options object for connection
 * @return {EventEmitter}
 */

export const DEFAULT_OPTIONS = {
  logLevel: 'error',
  dataStore: new MemoryDataStore(),
  autoReconnect: true,
  autoJoinNewChannels: false
}

export default class SlackHandler extends EventEmitter {
  constructor({ token, options = {} }) {
    super()

    this._slack = new RtmClient(token, Object.assign(DEFAULT_OPTIONS, options))
    this._initEvents()
    this._slack.start()
  }

  reconnect() {
    this._slack = null
    this._slack = new RtmClient(token, Object.assign(DEFAULT_OPTIONS, options))
    this._initEvents()
    this._slack.start()
  }

  _initEvents() {
    this._slack.on(CLIENT_EVENTS.RTM.AUTHENTICATED, ({ self, team }) => this.emit('connected', { name: self.name, team: team.name }))

    this._slack.on(CLIENT_EVENTS.RTM.DISCONNECT, () => this.emit('disconnected'))

    this._slack.on(CLIENT_EVENTS.RTM.UNABLE_TO_RTM_START, () => this.emit('disconnected'))

    this._slack.on(CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED, () => this._canSend = true)

    this._slack.on(RTM_EVENTS.MESSAGE, ({ text, user, channel }) => {
      this.emit('message', { text, user, channel })
    })

    this._slack.on(RTM_EVENTS.CHANNEL_CREATED, (message) => {
      //logic to join the new channel here
    })

  }

  sendMessage(text, channelID) {
    if (channelID.startsWith('U')) {
      const user = this._slack.dataStore.getUserById(channelID)
      this._slack.sendMessage(text, this.dataStore.getDMByName(user.name).id)
    } else {
      this._slack.sendMessage(text, channelID)
    }
  }

  sendCustomMessage({ text }, channelID) {
    request.post('https://slack.com/api/chat.postMessage', {
      channel: channelID,
      token: this._slack._token,
      link_names: 1,
      as_user: true,
      ...message,
      text: text.trim(),
      json: true
    }, (err, resp, { error }) => {
      if (err || error) {
        console.error(error)
      }
    })
  }

  getChannelHistoryByID(channelID, start = 0, end = 100) {

  }

  getUserById(userID) {
    const { id, name, profile } = this._slack.dataStore.getUserById(userID)
    return { id, name, meta: { email: profile.email } }
  }

  get channels() {
    return [{
      name: '# general',
      id: 'lalala',
      userIDs: ['Uas1231']
    }]
  }

  get DMs() {
    // same as users
  }

  get team() {
    return [{
      name: 'Magics',
      id: 'T72561',
      icon: ''
    }]
  }

  get users() {
    return [{
      name: 'luigiplr',
      handle: 'luigiplr',
      id: 'U72152',
      avatar: 'photo',
      meta: {
        email: 'a@b.com'
      }
    }]
  }

  get type() {
    return 'slack'
  }
}
