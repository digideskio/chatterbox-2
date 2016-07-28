import { push as locationPush } from 'react-router-redux'

export const TEAMS_ACTIVE_TEAM_CHANGE = 'TEAMS_ACTIVE_TEAM_CHANGE'
export const TEAMS_ACTIVE_CHANNEL_OR_DM_CHANGE = 'TEAMS_ACTIVE_CHANNEL_OR_DM_CHANGE'
export const TEAMS_TEAM_LOAD = 'TEAMS_TEAM_LOAD'
export const TEAMS_TEAM_ADD = 'TEAMS_TEAM_ADD'
export const TEAMS_TEAM_CHANGE = 'TEAMS_TEAM_CHANGE'
export const TEAMS_TEAM_REMOVE = 'TEAMS_TEAM_REMOVE'


export function addTeam(Handler) {
  return (dispatch) => {
    dispatch({ type: TEAMS_TEAM_ADD, team: Object.assign(Handler, { activeChannelorDMID: Handler.initialActiveChannelorDMID }) })
    dispatch(changeActiveTeam(Handler.team.id))
    dispatch(locationPush('/chat'))
  }
}

export function loadTeam(Handler) {
  return { type: TEAMS_TEAM_ADD, team: Object.assign(Handler, { activeChannelorDMID: Handler.initialActiveChannelorDMID }) }
}

export function removeTeam(team) {
  return { type: TEAMS_TEAM_REMOVE, team }
}

export function changeTeam(team) {
  return { type: TEAMS_TEAM_CHANGE, team }
}

export function changeActiveTeam(team) {
  return { type: TEAMS_ACTIVE_TEAM_CHANGE, team }
}

export function changeActiveTeamChannelOrDM(channel_or_dm_id, teamID) {
  return { type: TEAMS_ACTIVE_CHANNEL_OR_DM_CHANGE, channel_or_dm_id, team: teamID }
}
