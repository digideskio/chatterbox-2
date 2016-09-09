import { push as locationPush } from 'react-router-redux'

import * as TeamsActions from './teams'
import createTeamHandler from 'lib/teamHandler'

export const LOGIN_TEAM_ADD = 'LOGIN_TEAM_ADD'
export const LOGIN_TEAM_ADD_SUCCESS = 'LOGIN_TEAM_ADD_SUCCESS'
export const LOGIN_TEAM_ADD_FAIL = 'LOGIN_TEAM_ADD_FAIL'
export const LOGIN_PROVIDER_ERROR = 'LOGIN_PROVIDER_ERROR'
export const LOGIN_PROVIDER_CHANGE = 'LOGIN_PROVIDER_CHANGE'

export function showLogin() {
  return (dispatch) => {
    dispatch(locationPush('/login'))
    dispatch(TeamsActions.changeActiveTeam(null))
  }
}

export function addTeam(provider, opts = {}) {
  return {
    types: [LOGIN_TEAM_ADD, LOGIN_TEAM_ADD_SUCCESS, LOGIN_TEAM_ADD_FAIL],
    promise: (dispatch, getState) => new Promise((resolve, reject) => {
      const TeamHandler = createTeamHandler(provider)
      const Team = new TeamHandler(opts, dispatch, true)
      Team.once('connected', () => {
        resolve(Team)
        dispatch(TeamsActions.addTeam(Team))
      })
      Team.once('failed', () => {
        reject(Team)
      })
    })
  }
}

export function changeProvider(provider) {
  return { type: LOGIN_PROVIDER_CHANGE, provider }
}
