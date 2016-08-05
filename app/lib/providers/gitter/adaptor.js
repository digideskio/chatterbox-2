import { EventEmitter } from 'events'
import uuid from 'node-uuid'
import _ from 'lodash'
import GitterClient from 'node-gitter'
import { sanitizeRoomToChannel, sanitizeRoomToDM, santitizeUser, santitizeMessage } from './helpers'


export default class GitterHandler extends EventEmitter {
  constructor({ token }) {
    super()

    this._gitter = new GitterClient(token)
    this._initEvents()

    this._teamID = uuid.v1()
    this._datastore = {
      channels: {},
      dms: {},
      team: {},
      users: {},
      user: {}
    }
  }

  _initEvents() {
    this._gitter.currentUser()
      .then((user) => {
        this._datastore.user = santitizeUser(user)
        this.emit('authenticated')
        return user.rooms()
      })
      .then(rooms => Promise.all(rooms.map(::this._parseRoom)))
      .then(() => {
        console.info('all rooms parsed.')
        this._activeChannelorDMID = Object.keys(this._datastore.channels)[0]
        this.emit('connected', true)
      })
  }

  _parseRoom({ id: roomId }) {
    return new Promise(resolve => {
      this._gitter.rooms.find(roomId)
        .then(room => Promise.all([room.users(), room.chatMessages()]).then(data => [room, ...data]))
        .then(([room, users = [], messages = []]) => {
          switch (room.githubType) {
            case 'ONETOONE':
              this._datastore.dms[room.id] = sanitizeRoomToDM(room)
              break
            case 'REPO':
              this._datastore.channels[room.id] = sanitizeRoomToChannel(room)
              break
          }

          users.forEach(({ id, ...user }) => {
            if (!this._datastore.users[id]) {
              this._datastore.users[id] = santitizeUser({ id, ...user })
            }
          })

          this.emit('history', room.id, messages.map(santitizeMessage))

          return room
        })
        .then(::this._initRoomEvents)
        .then(resolve)
        .catch(err => {
          console.error(err)
          resolve()
        })
    })
  }

  _initRoomEvents(room) {
    const events = room.streaming()
    events.chatMessages().on('chatMessages', (message) => {
      console.log(message)
    })
  }

  history = {
    request: () => {}
  }

  message = {
    send: (channelID, message) => {},
    edit: (channelID, messageID, editedMessage) => {},
    remove: (channelID, messageID) => {}
  }

  _canSend = false
  _connected = false

  _getHistoryByID({ channel_or_dm_id, count = 50, latest = null, oldest = 0 }) {

  }

  get channels() {
    return this._datastore.channels
  }

  get dms() {
    return this._datastore.dms
  }

  get team() {
    return {
      name: 'Gitter',
      id: this._teamID,
      image: 'https://d1qb2nb5cznatu.cloudfront.net/startups/i/368944-d81438d134dc6c5567ffaab69861cb34-medium_jpg.jpg?buster=1404125976',
      type: 'gitter'
    }
  }

  get users() {
    return this._datastore.users
  }

  get user() {
    return this._datastore.user
  }

  get _persistenceData() {
    return {
      ..._.pick(this.team, 'name', 'id', 'type'),
      args: { token: this._gitter.client.token }
    }
  }
}
