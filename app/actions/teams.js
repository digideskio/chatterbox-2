import { push as locationPush } from 'react-router-redux'
import createTeamHandler from 'lib/teamHandler'
import Database from 'lib/database'

export const TEAMS_ACTIVE_TEAM_CHANGE = 'TEAMS_ACTIVE_TEAM_CHANGE'
export const TEAMS_ACTIVE_CHANNEL_OR_DM_CHANGE = 'TEAMS_ACTIVE_CHANNEL_OR_DM_CHANGE'

export const TEAMS_LOAD = 'TEAMS_LOAD'
export const TEAMS_LOAD_SUCCESS = 'TEAMS_LOAD_SUCCESS'
export const TEAMS_LOAD_FAIL = 'TEAMS_LOAD_FAIL'

export const TEAMS_TEAM_ADD = 'TEAMS_TEAM_ADD'
export const TEAMS_TEAM_CHANGE = 'TEAMS_TEAM_CHANGE'
export const TEAMS_TEAM_REMOVE = 'TEAMS_TEAM_REMOVE'

function parseHandler({ user, team, channels, dms, message, history, initialActiveChannelorDMID }) {
  return { user, team, channels, dms, message, history, initialActiveChannelorDMID }
}

export function addTeam(Handler) {
  return (dispatch) => {
    const team = parseHandler(Handler)
    const { id } = team.team
    dispatch({ type: TEAMS_TEAM_ADD, payload: { team, id } })
    dispatch(changeActiveTeam(id))
    dispatch(locationPush('/chat'))
  }
}

export function loadTeam(Handler) {
  return { type: TEAMS_TEAM_ADD, team: parseHandler(Handler) }
}

export function removeTeam(team) {
  return { type: TEAMS_TEAM_REMOVE, payload: team }
}

export function changeTeam(team) {
  return { type: TEAMS_TEAM_CHANGE, payload: team }
}

export function changeActiveTeam(team) {
  return (dispatch, getState) => {
    const { teams: { activeTeamID } } = getState()
    if (team === activeTeamID) return
    dispatch({ type: TEAMS_ACTIVE_TEAM_CHANGE, payload: team })
    if (team) dispatch(locationPush('/chat'))
  }
}

export function changeActiveTeamChannelOrDM(channel_or_dm_id, teamID) {
  return { type: TEAMS_ACTIVE_CHANNEL_OR_DM_CHANGE, payload: { activeChannelorDMID: channel_or_dm_id, team: teamID } }
}

export function loadTeams() {
  return {
    types: [TEAMS_LOAD, TEAMS_LOAD_SUCCESS, TEAMS_LOAD_FAIL],
    promise: (dispatch, getState) => new Promise((resolve, reject) => {
      const loader = new Database.teams.Loader()
      let firstLoaded = false

      loader.on('team', ({ id, name, type, args }) => {
        const TeamHandler = createTeamHandler(type)
        const Team = new TeamHandler(args, dispatch, false)

        Team.once('connected', () => {
          dispatch(addTeam(Team))
          if (!firstLoaded) {
            firstLoaded = true
            dispatch(changeTeam(Team.team.id))
          }
        })
      })

      loader.once('finnished', (num) => {
        if (num === 0) {
          resolve()
        }
      })
    })
  }
}
