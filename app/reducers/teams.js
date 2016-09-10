import { combineReducers } from 'redux'
import { without } from 'lodash'

import {
  TEAMS_ACTIVE_TEAM_CHANGE,
  TEAMS_ACTIVE_CHANNEL_OR_DM_CHANGE,
  TEAMS_TEAM_ADD,

  TEAMS_LOAD,
  TEAMS_LOAD_SUCCESS,
  TEAMS_LOAD_FAIL
} from 'actions/teams'

const DEFAULT_STATE = {
  loading: [],
  teams: {},
  activeTeamID: null
}

function loading(state = DEFAULT_STATE.loading, { type, payload }) {
  switch (type) {
    case TEAMS_LOAD:
      return payload ? [...state, payload] : state
    case TEAMS_LOAD_FAIL:
    case TEAMS_LOAD_SUCCESS:
      return without(state, payload)
    default:
      return state
  }
}

function teams(state = DEFAULT_STATE.teams, { type, payload }) {
  switch (type) {
    case TEAMS_TEAM_ADD:
      return {...state, [payload.id]: payload.team }
    case TEAMS_ACTIVE_CHANNEL_OR_DM_CHANGE:
      return {...state, [payload.team]: payload.activeChannelorDMID }
    default:
      return state
  }
}

function activeTeamID(state = DEFAULT_STATE.activeTeamID, { type, payload }) {
  if (type === TEAMS_ACTIVE_TEAM_CHANGE) {
    return payload
  }
  return state
}

export default combineReducers({
  loading,
  teams,
  activeTeamID
})
