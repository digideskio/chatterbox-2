import { EventEmitter } from 'events'
import _ from 'lodash'
import { WebClient, RtmClient, MemoryDataStore, CLIENT_EVENTS, RTM_EVENTS } from '@slack/client'
import { santitizeUser, parseMessage } from './helpers'


export default class SlackHandler extends EventEmitter {
  constructor({ token }) {
    super()

    this._slack = new RtmClient(token, {
      logLevel: 'error',
      dataStore: new MemoryDataStore(),
      autoReconnect: true,
      autoJoinNewChannels: false
    })

    this._slack.on(CLIENT_EVENTS.RTM.AUTHENTICATED, () => {
      this._connected = true
      this._slack._webClient = new WebClient(this._slack._token)
      this.emit('authenticated')
    })

    this._slack.on(CLIENT_EVENTS.RTM.ATTEMPTING_RECONNECT, () => {
      this._connected = false
      this._canSend = false
      console.warn('O SHIT SLACK BE RECONNECTING')
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
      const { channels } = this
      this._activeChannelorDMID = channels[_.findKey(channels, 'main')].id
      this.emit('connected')
    })

    this._slack.on(RTM_EVENTS.MESSAGE, parseMessage.bind(this))

    this._slack.start()
  }

  message = {
    send: (channelID, text, timestamp) => {
      const { id: userID } = this.user
      this.emit('message', parseMessage.bind(this)({ type: 'message', text, ts: timestamp, user: userID, channel: channelID, isSending: true }, true))

      return this._slack.sendMessage(text, channelID).then(m => parseMessage.bind(this)(m, true))
    },
    edit: (channelID, messageID, editedMessage, custom = false) => {},
    remove: (channelID, messageID) => {}
  }

  _canSend = false
  _connected = false

  _getHistoryByID({ channel_or_dm_id, count = 100, latest = null, oldest = null, inclusive = 0 }) {
    return new Promise((resolve, reject) => {
      let method = 'channels'
      if (channel_or_dm_id.startsWith('D')) method = 'im'
      if (channel_or_dm_id.startsWith('G')) method = 'groups'
      this._slack._webClient[method].history(channel_or_dm_id, { inclusive, count, latest, oldest, unreads: true }, (a, { has_more, messages = [], ok, unread_count_display }) => {
        if (!ok) return reject()
        const santitizedMessages = messages.map(m => parseMessage.bind(this)(m, true)).filter(Boolean).reverse()
        resolve(santitizedMessages)
      })
    })
  }

  get channels() {
    const channels = {}
    const { users } = this
    _.forEach({ ...this._slack.dataStore.channels, ...this._slack.dataStore.groups }, ({ is_archived, is_open, is_member: isMember, name, is_general: main, id, members, topic, purpose }) => {
      if (is_archived || (!is_open && id.startsWith('G'))) return
      channels[id] = ({
        isMember: id.startsWith('G') || isMember,
        isPrivate: id.startsWith('G'),
        name: id.startsWith('G') ? name : `#${name}`,
        id,
        main,
        members: members != undefined ? members.map(id => users[id] ? id : false).filter(Boolean) || [] : [],
        meta: { topic: _.get(topic, 'value', null), purpose: _.get(purpose, 'value', null) }
      })
    })
    return channels
  }

  get dms() {
    const dms = {}
    const { users } = this
    const readableDMs = _.pickBy(this._slack.dataStore.dms, ({ user, is_im }) => is_im && users[user])
    _.forEach(readableDMs, ({ is_open: isOpen, user, id }) => {
      const { name, presence, images, handle } = users[user]
      dms[id] = ({
        isOpen,
        id,
        presence,
        name: `@${handle}`,
        handle,
        image: _.last(images),
        user,
        meta: { members: presence, topic: name }
      })
    })
    return dms
  }

  get team() {
    const { name, icon, id } = this._slack.dataStore.teams[Object.keys(this._slack.dataStore.teams)[0]]
    return { name, id, image: icon.image_original, type: 'slack' }
  }

  get users() {
    const users = {}
    _.forEach(this._slack.dataStore.users, (user) => {
      if (!_.get(user, 'deleted', false)) {
        users[user.id] = santitizeUser(user)
      }
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
