import _ from 'lodash'
import { queue } from 'async'
import Database from 'lib/database'
import { addHistory, newMessage, editMessage, historyIsLoading } from 'actions/messages'
import { notifyNewMessage } from 'actions/notifications'

export default function createTeamHandler(provider) {
  const Provider = require(`./providers/${provider}/adaptor`)

  return class Team extends Provider {
    constructor(providerOpts, dispatch, firstLoad = false) {
      super(providerOpts)

      this._dispatch = dispatch
      this._initTeamEvents({ firstLoad })
    }

    _historyRequestQueue = queue(({ channel_or_dm_id, args }, next) => {
      this._dispatch(historyIsLoading(this.team.id, channel_or_dm_id))
      this._getHistoryByID({ channel_or_dm_id, ...args })
        .then(messages => this.emit('history', channel_or_dm_id, messages))
        .then(() => process.nextTick(next))
        .catch(next) // yes we should deal with any errors here later
    })

    initHistory() {
      const {
        [this.initialActiveChannelorDMID]: { id: mainChannelID }, ...channels
      } = this.channels

      this._historyRequestQueue.push({ channel_or_dm_id: mainChannelID })
      _.forEach({
        ..._.pickBy(channels, ({ isMember }) => isMember),
        ..._.pickBy(this.dms, ({ isOpen }) => isOpen)
      }, ({ id }) => this._historyRequestQueue.push({ channel_or_dm_id: id }))
    }

    history = {
      request: (startTimestamp, endTimestamp, channel_or_dm_id, count) => {
        this._getHistoryByID({ channel_or_dm_id, count, latest: startTimestamp, oldest: endTimestamp }).then(messages => {
          this._dispatch(addHistory({ messages, channel: channel_or_dm_id, team: this.team.id }))
        })
      }
    }

    loadHistory(channel_or_dm_id) {
      return this._getHistoryByID({ channel_or_dm_id })
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

      this.on('history', (channel, messages) => {
        this._dispatch(addHistory({ messages, channel, team: this.team.id }))
      })

      this.on('connected', (bypassDefualtHistoryFetch = false) => {
        if (!bypassDefualtHistoryFetch) this.initHistory()
        console.log(this)
        console.log(`Connected to ${this.team.type} team: ${this.team.name} via ${this.user.handle}`)
      })

      this.on('message', ({ channel, ...message }) => {
        this._dispatch(newMessage({ channel, message, team: this.team.id }))
        this.dispatch(notifyNewMessage(this.team.id, channel, message))
      })

      this.on('message:changed', ({ channel, ...editData }) => {
        this._dispatch(editMessage({ channel, team: this.team.id, ...editData }))
      })
    }
  }
}
