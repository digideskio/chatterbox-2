import * as TeamsActions from './teams'
import { bindActionCreators } from 'redux'
import createTeamHandler from 'lib/teamHandler'

export const TEAM_ADD = 'TEAM_ADD'
export const PROVIDER_ERROR = 'PROVIDER_ERROR'
export const PROVIDER_CHANGE = 'PROVIDER_CHANGE'


export function addTeam(provider, opts = {}) {
  return (dispatch, getState) => {
    //dispatch({ type: PROVIDER_CHANGE, provider: { ...getState().login.provider, authenticating: true } })

    const TeamActions = bindActionCreators(TeamsActions, dispatch)
    const TeamHandler = createTeamHandler(provider)
    const Team = new TeamHandler(opts, dispatch)
    Team.once('connected', (TeamData) => TeamActions.addTeam(Team))

    Team.once('some_error_event', (teamData) => {
      //dispatch({ type: PROVIDER_ERROR, provider: {...getState().login.provider, authenticating: false, error } })
    })
  }
}

export function changeProvider(provider) {
  return { type: PROVIDER_CHANGE, provider }
}
