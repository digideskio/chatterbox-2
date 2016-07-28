import * as TeamsActions from './teams'
import { bindActionCreators } from 'redux'
import createTeamHandler from 'lib/teamHandler'

export const LOGIN_TEAM_ADD = 'LOGIN_TEAM_ADD'
export const LOGIN_PROVIDER_ERROR = 'LOGIN_PROVIDER_ERROR'
export const LOGIN_PROVIDER_CHANGE = 'LOGIN_PROVIDER_CHANGE'


export function addTeam(provider, opts = {}) {
  return (dispatch, getState) => {
    // dispatch({ type: PROVIDER_CHANGE, provider: { ...getState().login.provider, authenticating: true } })
    const [TeamActions, TeamHandler] = [bindActionCreators(TeamsActions, dispatch), createTeamHandler(provider)]
    const Team = new TeamHandler(opts, dispatch, true)
    Team.once('connected', (TeamData) => TeamActions.addTeam(Team))

    Team.once('some_error_event', (teamData) => {
      // dispatch({ type: PROVIDER_ERROR, provider: {...getState().login.provider, authenticating: false, error } })
    })
  }
}

export function changeProvider(provider) {
  return { type: LOGIN_PROVIDER_CHANGE, provider }
}
