import { EventEmitter } from 'events'
import moment from 'moment'
import _ from 'lodash'
import { WebClient, RtmClient, MemoryDataStore, CLIENT_EVENTS, RTM_EVENTS } from '@slack/client'


const DEFAULT_OPTIONS = {
  logLevel: 'error',
  dataStore: new MemoryDataStore(),
  autoReconnect: true,
  autoJoinNewChannels: false
}

function parseMessage(type, message, overrideEvent = false) {
  switch (type) {
    case 'message':
      const { channel, user, text, ts } = message
      const msg = { channel, user, text, timestamp: ts, friendlyTimestamp: moment.unix(ts).format('h:mm a') }

      if (overrideEvent) return msg
      else this.emit('message', msg)
      break
    default:
      console.log(message)
  }
}

export default class SlackHandler extends EventEmitter {
  constructor({ token }) {
    super()

    this._slack = new RtmClient(token, DEFAULT_OPTIONS)

    this._slack.on(CLIENT_EVENTS.RTM.AUTHENTICATED, () => {
      this._connected = true
      this._slack._webClient = new WebClient(this._slack._token)
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
      this.emit('connected')
    })

    this._slack.on(RTM_EVENTS.MESSAGE, ({ type, ...message }) => parseMessage.bind(this)(type, message))

    this._slack.start()
  }

  _canSend = false
  _connected = false

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

  _getHistoryByID({ channel_or_dm_id, count = 50, latest = null, oldest = 0 }) {
    return new Promise((resolve, reject) => {
      this._slack._webClient.channels.history(channel_or_dm_id, { count, latest, oldest, unreads: true }, (a, { has_more, messages = [], ok, unread_count_display }) => {
        if (!ok) return reject()
        resolve(messages.reverse().map(({ type, ...message }) => parseMessage.bind(this)(type, message, true)))
      })
    })
  }

  get channels() {
    const channels = {}
    _.forEach(this._slack.dataStore.channels, ({ is_archived, name, is_general, id, members, topic, purpose }) => {
      if (is_archived) return
      channels[id] = ({
        name: `# ${name}`,
        id,
        main: is_general,
        members: members != undefined ? members.map(id => !this._slack.dataStore.users[id].deleted ? id : false).filter(Boolean) || [] : [],
        meta: { topic: _.get(topic, 'value', null), purpose: _.get(purpose, 'value', null) }
      })
    })
    return channels
  }

  get team() {
    const { name, icon, id } = this._slack.dataStore.teams[Object.keys(this._slack.dataStore.teams)[0]]
    return { name, id, image: icon.image_original, type: 'slack' }
  }

  get users() {
    const users = {}
    _.forEach(this._slack.dataStore.users, ({ tz, id, deleted, profile, name, presence }) => {
      if (deleted) return
      users[id] = ({
        handle: name,
        name: profile.real_name_normalized.length > 0 ? profile.real_name_normalized : null,
        id,
        presence: presence === 'active' ? 'online' : 'offline',
        images: _.filter(profile, (data, key) => key.includes('image')),
        meta: { timezone: tz, email: profile.email }
      })
    })
    return users
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
