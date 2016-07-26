import _ from 'lodash'
import { priorityQueue } from 'async'
import { ADD_HISTORY, NEW_MESSAGE, EDIT_MESSAGE, REMOVE_MESSAGE } from 'actions/teams'

export default function createTeamHandler(provider) {
  const Provider = require(`lib/handlers/${provider}`)

  return class Team extends Provider {
    constructor(providerOpts, dispatch) {
      super(providerOpts)


      this._dispatch = dispatch
      this._initTeamEvents()
    }

    _historyRequestQueue = priorityQueue(({ channel, args }, next) => {
      this._getHistoryByID({ channel_or_dm_id: channel, ...args })
        .then(messages => this.emit('history:loaded', { channel, messages }))
        .then(next)
        .catch(next) // yes we should deal with any errors here later
    })

    initHistory() {
      _.forEach(this.channels, ({ id, main }) => {
        this._historyRequestQueue.push({ channel: id }, main ? 10 : 1)
      })
    }

    _initTeamEvents() {
      this.on('connected', (teamData) => {
        console.log(`Connected to ${this.team.type} team: ${this.team.name} via ${this.user.handle}`)
      })

      this.on('history:loaded', ({ channel, messages }) => {
        this._dispatch({ type: ADD_HISTORY, messages, channel, team: this.team.id })
      })

      this.on('message', (message) => {
        this._dispatch({ type: NEW_MESSAGE, message, team: this.team.id })
      })
    }
  }
}
