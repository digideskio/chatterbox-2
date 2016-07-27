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

function santitizeUser({ tz: timezone, id, deleted, profile, name: handle, presence }) {
  return {
    handle,
    name: _.get(profile, 'real_name_normalized', '').length > 0 ? profile.real_name_normalized : null,
    id,
    presence: presence === 'active' ? 'online' : 'offline',
    images: _.filter(profile, (data, key) => key.includes('image')),
    meta: { timezone, email: _.get(profile, 'email') }
  }
}


function santitizeAttachments(attachments) {
  return attachments.map(({ title, text, pretext, ...attachment }) => {
    return {
      images: { thumb: attachment.thumb_url, author: attachment.author_icon },
      links: { author: attachment.author_link, title: attachment.title_link },
      author: attachment.author_name,
      title,
      pretext,
      text
    }
  })
}

function santitizeMessage({ user, text, ts: timestamp, user_profile: userProfile = null, attachments = [] }) {
  return {
    attachments: santitizeAttachments(attachments),
    user,
    text,
    userProfile,
    timestamp,
    friendlyTimestamp: moment.unix(timestamp).format('h:mm a')
  }
}

function parseMessage({ type, subtype, bot_id, channel = null, ...messageData }, overrideEvent = false) {
  let isBot = Boolean(bot_id)
  let userProfileChecked = false
  switch (subtype ? `${type}:${subtype}` : type) {
    case 'message:bot_message':
      (() => {
        isBot = true
        userProfileChecked = true
        const { images, icons, name: handle, id } = this._slack.dataStore.bots[bot_id]
        messageData.user_profile = { handle, id, image: _.last(_.filter((images || icons), (a, key) => key.includes('image'))) }
      })()
    case 'message:file_share':
    case 'message':
      return (() => {
        if (messageData.user_profile && !userProfileChecked) {
          const { name: handle, real_name: name, ...user_profile } = messageData.user_profile
          messageData.user_profile = {
            image: _.last(_.filter(user_profile, (a, key) => key.includes('image') || key.includes('icon'))),
            handle,
            name
          }
        }

        const msg = _.omitBy({ channel, isBot, ...santitizeMessage(messageData) }, _.isNil)
        if (overrideEvent) return msg
        else this.emit('message', msg)
      })()
    case 'message:message_changed':
      return (() => {
        const { message, event_ts: eventTimestamp, previous_message: { ts: previousMessageTimestamp } } = messageData
        const msg = { channel, message: santitizeMessage(message), edit: { eventTimestamp, previousMessageTimestamp } }

        if (overrideEvent) return msg
        else this.emit('message:changed', msg)
      })()
    default:
      console.info('Unable to parse message:', { type, subtype, ...messageData })
      return false
  }
}

export default class SlackHandler extends EventEmitter {
  constructor({ token }) {
    super()

    this._slack = new RtmClient(token, DEFAULT_OPTIONS)

    this._slack.on(CLIENT_EVENTS.RTM.AUTHENTICATED, () => {
      this._connected = true
      this._slack._webClient = new WebClient(this._slack._token)
      this.emit('authenticated')
    })

    this._slack.on(CLIENT_EVENTS.RTM.DISCONNECT, () => {
      this._canSend = false
      this._connected = false
      this.emit('disconnected')
    })

    this._slack.on(CLIENT_EVENTS.RTM.UNABLE_TO_RTM_START, () => {
      this._canSend = false
      this._connected = false
      console.error('o shit dawg, slack suffered some fuckin catastrophic error')
      this.emit('catastrophic_failure')
    })

    this._slack.on(CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED, () => {
      this._canSend = true
      this._activeChannelorDMID = this.channels[_.findKey(this.channels, 'main')].id
      this.emit('connected')
    })

    this._slack.on(RTM_EVENTS.MESSAGE, parseMessage.bind(this))

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
        const santitizedMessages = messages.map(m => parseMessage.bind(this)(m, true)).filter(Boolean).reverse()
        resolve(santitizedMessages)
      })
    })
  }

  get channels() {
    const channels = {}
    _.forEach(this._slack.dataStore.channels, ({ is_archived, name, is_general: main, id, members, topic, purpose }) => {
      if (is_archived) return
      channels[id] = ({
        name: `# ${name}`,
        id,
        main,
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
    _.forEach(this._slack.dataStore.users, ({ deleted, id, ...user }) => {
      if (!deleted) users[id] = santitizeUser({ id, ...user })
    })
    return users
  }

  get user() {
    const { id, ...user } = _.get(this._slack, `dataStore.users.${this._slack.activeUserId}`, {})
    return santitizeUser({ id, ...user })
  }

  get _persistenceData() {
    return {
      ..._.pick(this.team, 'name', 'id', 'type'),
      args: { token: this._slack._token }
    }
  }
}
