import { EventEmitter } from 'events'
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
      console.error('o shit')
      this.emit('catastrophic_failure')
    })

    this._slack.on(CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED, () => {
      console.log('slack connected')
      this._canSend = true
      this.emit('connected')
    })

    this._slack.on(RTM_EVENTS.MESSAGE, (message) => {
      console.log(message)
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
