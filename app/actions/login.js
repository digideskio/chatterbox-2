import * as TeamsActions from './teams'
import { bindActionCreators } from 'redux'
import TeamHandler from 'lib/teamHandler'


export const TEAM_ADD = 'TEAM_ADD'
export const PROVIDER_CHANGE = 'PROVIDER_CHANGE'


export function addTeam(provider, opts = {}) {
  return (dispatch, getState) => {
    const TeamActions = bindActionCreators(TeamsActions, dispatch)
    const ProviderHandler = require(`lib/handlers/${provider}`)
    const Team = new TeamHandler(new ProviderHandler(opts))

    Team.once('connected', (teamData) => {
      console.log(teamData)
    })
  }
}

export function changeProvider(provider) {
  return { type: PROVIDER_CHANGE, provider }
}
