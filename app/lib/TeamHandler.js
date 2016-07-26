import _ from 'lodash'
import { ADD_HISTORY, NEW_MESSAGE, EDIT_MESSAGE, REMOVE_MESSAGE } from 'actions/teams'

export default function createTeamHandler(provider) {
  const Provider = require(`lib/handlers/${provider}`)

  return class Team extends Provider {
    constructor(providerOpts, dispatch) {
      super(providerOpts)

      this._dispatch = dispatch
      this._initTeamEvents()
    }

    loadHistoryByID = (channel, args = {}) => this._getHistoryByID({ channel_or_dm_id: channel, ...args })

    _initTeamEvents() {
      this.on('connected', (teamData) => {
        console.log(`Connected to ${this.team.type} team: ${this.team.name} via ${this.user.handle}`)
      })

      this.on('message', (message) => {
        this._dispatch({ type: NEW_MESSAGE, ...message, team: this.team.id })
      })
    }
  }
}
