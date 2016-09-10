import { combineReducers } from 'redux'

import {
  TEAMS_ACTIVE_TEAM_CHANGE,
  TEAMS_ACTIVE_CHANNEL_OR_DM_CHANGE,
  TEAMS_TEAM_ADD
} from 'actions/teams'

const DEFAULT_STATE = {
  loading: [],
  teams: {},
  activeTeamID: null
}

function loading(state = DEFAULT_STATE.loading, { type, payload }) {
  return state
}

function teams(state = DEFAULT_STATE.teams, { type, payload }) {
  switch (action.type) {
    case TEAMS_TEAM_ADD:
      return {...state, [action.team.team.id]: action.team }
    case TEAMS_ACTIVE_CHANNEL_OR_DM_CHANGE:
      const { team, teams } = extractTeamFromTeams(action.team, state)
      team.activeChannelorDMID = action.channel_or_dm_id
      return {...teams, [action.team]: team }
    default:
      return state
  }
}

function activeTeamID(state = DEFAULT_STATE.activeTeamID, { type, action }) {
  if (action.type === TEAMS_ACTIVE_TEAM_CHANGE) {
    return action.team
  }
  return state
}

function extractTeamFromTeams(teamID, allTeams) {
  const {
    [teamID]: team, ...teams
  } = allTeams
  return { team, teams }
}


export default combineReducers({
  loading,
  teams,
  activeTeamID
})
