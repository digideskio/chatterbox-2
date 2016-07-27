import _ from 'lodash'
import Database from 'lib/database'
import { queue } from 'async'
import { ADD_HISTORY, NEW_MESSAGE, EDIT_MESSAGE, REMOVE_MESSAGE } from 'actions/messages'

export default function createTeamHandler(provider) {
  const Provider = require(`lib/handlers/${provider}`)

  return class Team extends Provider {
    constructor(providerOpts, dispatch, firstLoad = false) {
      super(providerOpts)

      this._dispatch = dispatch
      this._initTeamEvents({ firstLoad })
    }

    _historyRequestQueue = queue(({ channel, args }, next) => {
      this._getHistoryByID({ channel_or_dm_id: channel, ...args })
        .then(messages => this.emit('history:loaded', { channel, messages }))
        .then(() => process.nextTick(next))
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

    _initTeamEvents({ firstLoad }) {

      this.on('authenticated', () => {
        if (firstLoad) {
          Database.teams.add(this._persistenceData).then(() => {
            console.info('saved team')
          })
        }
      })

      this.on('connected', (teamData) => {
        this.initHistory()
        console.log(`Connected to ${this.team.type} team: ${this.team.name} via ${this.user.handle}`)
      })

      this.on('history:loaded', ({ channel, messages }) => {
        this._dispatch({ type: ADD_HISTORY, payload: { messages, channel, team: this.team.id } })
      })

      this.on('message', ({ channel, ...message }) => {
        this._dispatch({ type: NEW_MESSAGE, payload: { channel, message, team: this.team.id } })
      })

      this.on('message:changed', ({ channel, ...editData }) => {
        this._dispatch({ type: EDIT_MESSAGE, payload: { channel, team: this.team.id, ...editData } })
      })
    }
  }
}
