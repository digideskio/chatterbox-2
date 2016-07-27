import {
  ACTIVE_TEAM_CHANGE,
  ACTIVE_CHANNEL_OR_DM_CHANGE,
  TEAM_ADD,
  TEAM_REMOVE
} from 'actions/teams'


const DEFAULT_STATE = {
  teams: {},
  activeTeamID: null
}

export default function teams(state = DEFAULT_STATE, { type, ...action }) {
  switch (type) {
    case TEAM_ADD:
      return {...state, teams: {...state.teams, [action.team.team.id]: action.team } }
    case ACTIVE_TEAM_CHANGE:
      return {...state, activeTeamID: action.team }
    case ACTIVE_CHANNEL_OR_DM_CHANGE:
      return (() => {
        const { team, teams } = extractTeamfromTeams(action.team, state.teams)
        team.activeChannelorDMID = action.channel_or_dm_id
        return {...state, teams: {...teams, [action.team]: team } }
      })()
    default:
      return state
  }
}

const extractTeamfromTeams = (teamID, allTeams) => {
  const {
    [teamID]: team,
    ...teams
  } = allTeams
  return { team, teams }
}
