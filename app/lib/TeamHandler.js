import _ from 'lodash'
import { queue } from 'async'
import Database from 'lib/database'
import { addHistory, newMessage, editMessage } from 'actions/messages'

export default function createTeamHandler(provider) {
  const Provider = require(`lib/handlers/${provider}`)

  return class Team extends Provider {
    constructor(providerOpts, dispatch, firstLoad = false) {
      super(providerOpts)

      this._dispatch = dispatch
      this._initTeamEvents({ firstLoad })
    }

    _historyRequestQueue = queue(({ channel_or_dm_id, args }, next) => {
      this._getHistoryByID({ channel_or_dm_id, ...args })
        .then(messages => this._dispatch(addHistory({ messages, channel: channel_or_dm_id, team: this.getTeam().id })))
        .then(() => process.nextTick(next))
        .catch(next) // yes we should deal with any errors here later
    })

    initHistory() {
      const {
        [this.getInitialActiveChannelorDMID()]: { id: mainChannelID }, ...channels
      } = this.getChannels()

      this._historyRequestQueue.push({ channel_or_dm_id: mainChannelID })
      _.forEach({
        ..._.pickBy(channels, ({ isMember }) => isMember),
        ..._.pickBy(this.getDMs(), ({ isOpen }) => isOpen)
      }, ({ id }) => this._historyRequestQueue.push({ channel_or_dm_id: id }))
    }

    loadHistory(channel_or_dm_id) {
      return this._getHistoryByID({ channel_or_dm_id })
    }

    getInitialActiveChannelorDMID() {
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

      this.on('connected', () => {
        this.initHistory()
        const { type, name } = this.getTeam()
        console.log(`Connected to ${type} team: ${name} via ${this.getUser().handle}`)
      })

      this.on('message', ({ channel, ...message }) => {
        const { id: team } = this.getTeam()
        this._dispatch(newMessage({ channel, message, team }))
      })

      this.on('message:changed', ({ channel, ...editData }) => {
        const { id: team } = this.getTeam()
        this._dispatch(editMessage({ channel, team, ...editData }))
      })
    }
  }
}
