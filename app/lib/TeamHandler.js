import _ from 'lodash'


function loadHistory(channel, args = {}) {
  return this._getHistoryByID({ channel_or_dm_id: channel, ...args }).then(messages => {
    let needsSort = false
    if (!this.history[channel]) {
      this.history[channel] = messages
    } else {
      needsSort = true
      this.history[channel] = [...this.history[channel], ...messages]
    }

    if (needsSort)
      this.history[channel].sort((x, y) => x.timestamp - y.timestamp)

    return this.history
  })
}

export default function createTeamHandler(provider) {
  const Provider = require(`lib/handlers/${provider}`)

  return class Team extends Provider {
    constructor(providerOpts, dispatch) {
      super(providerOpts)


      this.history = {
        ...(this.history || {}),
        load: loadHistory.bind(this)
      }

      this._dispatch = dispatch
      this._initTeamEvents()
    }

    _initTeamEvents() {
      this.on('connected', (teamData) => {
        console.log(`Connected to ${this.team.type} team: ${this.team.name} via ${this.user.handle}`)
      })

      this.on('message', ({ channel, ...message }) => {
        if (!this.history[channel]) {
          this.history[channel] = [message]
        } else {
          this.history[channel].push(message)
        }
        console.log(message)
      })
    }
  }
}
