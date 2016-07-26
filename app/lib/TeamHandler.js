import _ from 'lodash'
import { queue } from 'async'
import { ADD_HISTORY, NEW_MESSAGE, EDIT_MESSAGE, REMOVE_MESSAGE } from 'actions/teams'

export default function createTeamHandler(provider) {
  const Provider = require(`lib/handlers/${provider}`)

  return class Team extends Provider {
    constructor(providerOpts, dispatch) {
      super(providerOpts)


      this._dispatch = dispatch
      this._initTeamEvents()
    }

    _historyRequestQueue = queue(({ channel, args }, next) => {
      this._getHistoryByID({ channel_or_dm_id: channel, ...args })
        .then(messages => this.emit('history:loaded', { channel, messages }))
        .then(next)
        .catch(next) // yes we should deal with any errors here later
    })

    initHistory() {
      const {
        [this.initialActiveChannelorDMID]: { id: mainChannelID }, ...channels
      } = this.channels

      this._historyRequestQueue.push({ channel: mainChannelID })
      _.forEach(channels, ({ id }) => this._historyRequestQueue.push({ channel: id }))
    }

    get initialActiveChannelorDMID() {
      return this._activeChannelorDMID
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
