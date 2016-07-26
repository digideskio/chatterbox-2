import { EventEmitter } from 'events'
import moment from 'moment'
import _ from 'lodash'
import selectn from 'selectn'
import { WebClient, RtmClient, MemoryDataStore, CLIENT_EVENTS, RTM_EVENTS } from '@slack/client'


const DEFAULT_OPTIONS = {
  logLevel: 'error',
  dataStore: new MemoryDataStore(),
  autoReconnect: true,
  autoJoinNewChannels: false
}

export default class SlackHandler extends EventEmitter {
  constructor({ token }) {
    super()

    this._slack = new RtmClient(token, DEFAULT_OPTIONS)
    this._initProviderEvents()
    this._slack.start()
  }

  _canSend = false
  _connected = false

  reconnect() {
    this._slack = null
    this._slack = new RtmClient(token, Object.assign(DEFAULT_OPTIONS, options))
    this._initProviderEvents()
    this._slack.start()
  }

  _initProviderEvents() {
    this._slack.on(CLIENT_EVENTS.RTM.AUTHENTICATED, () => {
      this._connected = true
      this._slackWeb = new WebClient(this._slack._token)
      this.emit('authenticated', _.pick(this, ['team']))
    })

    this._slack.on(CLIENT_EVENTS.RTM.DISCONNECT, () => {
      this._canSend = false
      this._connected = false
      this.emit('disconnected', _.pick(this, ['team']))
    })

    this._slack.on(CLIENT_EVENTS.RTM.UNABLE_TO_RTM_START, () => {
      this._canSend = false
      this._connected = false
      console.error('o shit dawg, slack suffered some fuckin catastrophic error')
      this.emit('catastrophic_failure')
    })

    this._slack.on(CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED, () => {
      this._canSend = true
      this.emit('connected', _.pick(this, ['channels', 'users', 'team', 'user']))
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

  message = {
    send(channelID, message, custom = false) {
      return new Promise((resolve, reject) => {
        if (channelID.startsWith('U')) {
          const { name } = this._slack.dataStore.getUserById(channelID)
          this._slack.sendMessage(message, this._slack.dataStore.getDMByName(name).id)
        } else {
          this._slack.sendMessage(message, channelID)
        }
      })
    },
    edit(channelID, messageID, editedMessage, custom = false) {},
    remove(channelID, messageID) {}
  }

  getChannelHistoryByID(channelID, start = 0, end = 100) {

  }

  get channels() {
    return Object.keys(this._slack.dataStore.channels)
      .map(channel => this._slack.dataStore.channels[channel])
      .map(({ is_archived, name, is_general, id, members, topic, purpose }) => is_archived ? false : {
        name,
        id,
        main: is_general,
        members: members || [],
        meta: { topic: selectn('value', topic), purpose: selectn('value', purpose) }
      })
      .filter(Boolean)
  }

  get team() {
    const { name, icon, id } = this._slack.dataStore.teams[Object.keys(this._slack.dataStore.teams)[0]]
    return { name, id, photo: icon.image_original, type: 'slack' }
  }

  get users() {
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
  }

  get user() {
    const { tz, id, deleted, profile, name, presence } = this._slack.dataStore.users[this._slack.activeUserId]
    return {
      handle: name,
      name: profile.real_name_normalized.length > 0 ? profile.real_name_normalized : null,
      id,
      presence,
      images: _.filter(profile, (data, key) => key.includes('image')),
      meta: { timezone: tz, email: profile.email }
    }
  }
}
