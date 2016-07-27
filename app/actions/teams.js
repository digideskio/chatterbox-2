import _ from 'lodash'
import { push as locationPush } from 'react-router-redux'

export const ACTIVE_TEAM_CHANGE = 'TEAMS_ACTIVE_TEAM_CHANGE'
export const ACTIVE_CHANNEL_OR_DM_CHANGE = 'TEAM_ACTIVE_CHANNEL_OR_DM_CHANGE'
export const TEAM_LOAD = 'TEAMS_TEAM_LOAD'
export const TEAM_ADD = 'TEAMS_TEAM_ADD'
export const TEAM_CHANGE = 'TEAMS_TEAM_CHANGE'
export const TEAM_REMOVE = 'TEAMS_TEAM_REMOVE'


export function addTeam(Handler) {
  return (dispatch) => {
    dispatch({ type: TEAM_ADD, team: Object.assign(Handler, { activeChannelorDMID: Handler.initialActiveChannelorDMID }) })
    dispatch({ type: ACTIVE_TEAM_CHANGE, team: Handler.team.id })
    dispatch(locationPush('/chat'))
  }
}

export function loadTeam(Handler) {
  return { type: TEAM_ADD, team: Object.assign(Handler, { activeChannelorDMID: Handler.initialActiveChannelorDMID }) }
}

export function removeTeam(team) {
  return { type: TEAM_REMOVE, team }
}

export function changeTeam(team) {
  return { type: TEAM_CHANGE, team }
}

export function changeActiveTeam(team) {
  return { type: ACTIVE_TEAM_CHANGE, team }
}

export function changeActiveTeamChannelOrDM(channel_or_dm_id, teamID) {
  return { type: ACTIVE_CHANNEL_OR_DM_CHANGE, channel_or_dm_id, team: teamID }
}
