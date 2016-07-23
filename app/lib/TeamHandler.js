import { EventEmitter } from 'events'
import _ from 'lodash'
import HistoryManager from './history'


export default class TeamHandler extends EventEmitter {
  constructor(Handler) {
    super()
      //this._history = new HistoryManager(connectionHandler, config)
    this._connection = Handler

    this._initEvents()
  }

  _initEvents() {
    const { _connection } = this

    _connection.on('connected', ({ team, name, teamType }) => console.log(`Connected to ${_connection.type} team: ${team} via ${name}`))

    _connection.on('message', message => {
      const { text, channel, user } = this._getMessageContents(message)
      process.env.lastTeamID = this._teamID
      this._lastChannel = channel
      this._parseCommand(_connection.type, command, text, channel, user)
    })
  }

  _parseCommand(conectionType, command, text, channel, user) {

  }

  _getMessageContents(message) {
    const { users, channels } = this._connection
    const user = this._connection.getUserById(message.user)

    return {
      users,
      channel: {
        history: this._history.history[message.channel],
        sendCustomMessage: (customMessage = {}, prefix = `(${user.name})`) => this._connection.emit('sendCustomMessage', prefix, customMessage, message.channel),
        sendMessage: (text = '', prefix = `(${user.name})`) => this._connection.emit('sendMessage', `${prefix || ''} ${text}`.trim(), message.channel),
      },
      text: message.text,
      user: {
        ...user,
        sendMessage: (text = '', prefix = `(${user.name})`) => this._connection.emit('sendMessage', `${prefix || ''} ${text}`.trim(), message.user),
      }
    }
  }
}
