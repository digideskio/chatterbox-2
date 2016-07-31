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
      const channels = this.getChannels()
      this._activeChannelorDMID = channels[_.findKey(channels, 'main')].id
      this.emit('connected')
      console.log(this)
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

  getChannels() {
    const channels = {}
    const users = this.getUsers()
    _.forEach(this._slack.dataStore.channels, ({ is_archived, is_member: isMember, name, is_general: main, id, members, topic, purpose }) => {
      if (is_archived) return
      channels[id] = ({
        isMember,
        name: `# ${name}`,
        id,
        main,
        members: members != undefined ? members.map(id => !users[id] ? id : false).filter(Boolean) || [] : [],
        meta: { topic: _.get(topic, 'value', null), purpose: _.get(purpose, 'value', null) }
      })
    })
    return channels
  }

  getDMs() {
    const dms = {}
    const users = this.getUsers()
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

  getTeam() {
    const { name, icon, id } = this._slack.dataStore.teams[Object.keys(this._slack.dataStore.teams)[0]]
    return { name, id, image: icon.image_original, type: 'slack' }
  }

  getUsers() {
    const users = {}
    _.forEach(this._slack.dataStore.users, (user) => {
      if (!_.get(user, 'deleted', false)) users[user.id] = santitizeUser(user)
    })
    return users
  }

  getUser() {
    return santitizeUser(_.get(this._slack, `dataStore.users.${this._slack.activeUserId}`, {}))
  }

  getPersistenceData() {
    return {
      ..._.pick(this.getTeam(), 'name', 'id', 'type'),
      args: { token: this._slack._token }
    }
  }
}
