import { EventEmitter } from 'events'
import _ from 'lodash'


export default class TeamHandler extends EventEmitter {
  constructor(Handler) {
    super()
    this._connection = Handler
    this._initEvents()
  }

  _initEvents() {
    if (!this._connection.connected) {
      this._connection.on('connected', ({ team, user, users }) => {
        console.log(`Connected to ${team.type} team: ${team.name} via ${user.handle}`)
        this.emit('connected', { team, user, users })
      })
    } else {
      console.log(`Connected to ${this._connection.team.type} team: ${this._connection.team.name} via ${this._connection.user.handle}`)
    }

    this._connection.on('message', message => {
      console.log(message)

    })
  }


}
