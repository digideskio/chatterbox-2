import { EventEmitter } from 'events'
import _ from 'lodash'
import { WebClient, RtmClient, MemoryDataStore, CLIENT_EVENTS, RTM_EVENTS } from '@slack/client'
import { santitizeUser, parseMessage } from './slack.helpers'

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

  message = {
    send: (channelID, message, custom = false) => {
      return this._slack.sendMessage(message, channelID).then(message => {
        parseMessage.bind(this)(message)
        return message
      })
    },
    edit: (channelID, messageID, editedMessage, custom = false) => {},
    remove: (channelID, messageID) => {}
  }

  _canSend = false
  _connected = false

  _getHistoryByID({ channel_or_dm_id, count = 50, latest = null, oldest = 0 }) {
    return new Promise((resolve, reject) => {
      let method = 'channels'
      if (channel_or_dm_id.startsWith('D')) method = 'im'
      this._slack._webClient[method].history(channel_or_dm_id, { count, latest, oldest, unreads: true }, (a, { has_more, messages = [], ok, unread_count_display }) => {
        if (!ok) return reject()
        const santitizedMessages = messages.map(m => parseMessage.bind(this)(m, true)).filter(Boolean).reverse()
        resolve(santitizedMessages)
      })
    })
  }

  get channels() {
    const channels = {}
    const users = this.users
    _.forEach(this._slack.dataStore.channels, ({ is_archived, is_member: isMember, name, is_general: main, id, members, topic, purpose }) => {
      if (is_archived) return
      channels[id] = ({
        isMember,
        name: `# ${name}`,
        id,
        main,
        members: members != undefined ? members.map(id => !users[id].deleted ? id : false).filter(Boolean) || [] : [],
        meta: { topic: _.get(topic, 'value', null), purpose: _.get(purpose, 'value', null) }
      })
    })
    return channels
  }

  get dms() {
    const dms = {}
    const users = this.users
    _.forEach(this._slack.dataStore.dms, ({ is_open: isOpen, is_im, user, id }) => {
      if (!is_im) return
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
    _.forEach(this._slack.dataStore.users, ({ deleted, id, ...user }) => {
      users[id] = santitizeUser({ id, ...user })
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
