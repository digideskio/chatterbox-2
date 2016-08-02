import { EventEmitter } from 'events'
import GitterClient from 'node-gitter'


export default class GitterHandler extends EventEmitter {
  constructor({ token }) {
    super()

    this._gitter = new GitterClient(token)

    this._gitter.currentUser()
      .then((user) => {
        const rooms = user.rooms()
        const repos = user.repos()
        const orgs = user.orgs()
        const channels = user.channels()
        console.log(user, rooms, repos, orgs, channels)
      })
  }

  _initGitterEvents(roomId) {
    // this will be intresting
    this._gitter.rooms.find(roomId).then((room) => {
      var events = room.streaming().chatMessages()

      // The 'snapshot' event is emitted once, with the last messages in the room
      events.on('snapshot', function(snapshot) {
        console.log(snapshot.length + ' messages in the snapshot')
      })

      // The 'chatMessages' event is emitted on each new message
      events.on('chatMessages', function(message) {
        console.log('A message was ' + message.operation)
        console.log('Text: ', message.model.text)
      })
    })
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

  }

  get dms() {

  }

  get team() {

  }

  get users() {

  }

  get user() {

  }

  get _persistenceData() {

  }
}
