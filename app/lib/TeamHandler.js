import _ from 'lodash'


export default function createTeamHandler(Handler) {
  return class TeamHandler extends Handler {
    constructor(providerOpts, dispatch) {
      super(providerOpts)

      this._dispatch = dispatch
      this._initTeamEvents()
    }

    _initTeamEvents() {
      if (!this._connected) {
        this.on('connected', (teamData) => {
          console.log(`Connected to ${teamData.team.type} team: ${teamData.team.name} via ${teamData.user.handle}`)
        })
      } else {
        console.log(`Connected to ${this._connection.team.type} team: ${this._connection.team.name} via ${this._connection.user.handle}`)
      }

      this.on('message', message => {
        console.log(message)

      })
    }
  }

}
