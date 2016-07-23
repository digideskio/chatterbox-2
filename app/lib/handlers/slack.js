import { EventEmitter } from 'events'
import moment from 'moment'
import _ from 'lodash'
import selectn from 'selectn'
import { RtmClient, MemoryDataStore, CLIENT_EVENTS, RTM_EVENTS } from '@slack/client'


const DEFAULT_OPTIONS = {
  logLevel: 'error',
  dataStore: new MemoryDataStore(),
  autoReconnect: true,
  autoJoinNewChannels: false
}

export default class SlackHandler extends EventEmitter {
  constructor(token) {
    super()

    this._slack = new RtmClient(token, DEFAULT_OPTIONS)
    this._initEvents()
    this._slack.start()
  }

  _canSend = false

  reconnect() {
    this._slack = null
    this._slack = new RtmClient(token, Object.assign(DEFAULT_OPTIONS, options))
    this._initEvents()
    this._slack.start()
  }

  _initEvents() {
    this._slack.on(CLIENT_EVENTS.RTM.AUTHENTICATED, () => {
      console.info('slack authenticated')
      this.emit('authenticated')
    })

    this._slack.on(CLIENT_EVENTS.RTM.DISCONNECT, () => {
      console.info('slack disconnected')
      this.emit('disconnected')
    })

    this._slack.on(CLIENT_EVENTS.RTM.UNABLE_TO_RTM_START, () => {
      console.error('o shit dawg, slack suffered some fuckin catastrophic error')
      this.emit('catastrophic_failure')
    })

    this._slack.on(CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED, () => {
      console.info('slack connected')
      this._canSend = true
      const { channels, users } = this
      this.emit('connected', { channels, users })
    })

    this._slack.on(RTM_EVENTS.MESSAGE, ({ type, channel, user, text, ts }) => {
      switch (type) {
        case 'message':
          this.emit('message', { channel, user, text, timestamp: ts })
          break
        default:
      }
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
    return Object.keys(this._slack.dataStore.channels)
      .map(channel => this._slack.dataStore.channels[channel])
      .map(({ is_archived, name, is_general, id, members, topic, purpose }) => is_archived ? false : {
        name,
        id,
        main: is_general,
        members: members || [],
        meta: {
          topic: selectn('value', topic),
          purpose: selectn('value', purpose),
        }
      })
      .filter(Boolean)
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
    console.log(this)
    return Object.keys(this._slack.dataStore.users)
      .map(user => this._slack.dataStore.users[user])
      .map(({ tz, id, deleted, profile, name, presence }) => deleted ? false : {
        handle: name,
        name: profile.real_name_normalized.length > 0 ? profile.real_name_normalized : null,
        id,
        presence,
        images: _.filter(profile, (data, key) => key.includes('image')),
        meta: { timezone: tz, email: profile.email }
      })
      .filter(Boolean)
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
}
