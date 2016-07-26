import {
  ACTIVE_TEAM_CHANGE,
  ACTIVE_CHANNEL_OR_DM_CHANGE,
  TEAM_ADD,
  TEAM_REMOVE,

  NEW_MESSAGE,
  MODIFY_MESSAGE,
  EDIT_MESSAGE,
  REMOVE_MESSAGE
} from 'actions/teams'

/*

team: {
  users: {},
  channels: {},
  messages: {
    channelID: []
  },
  dms: {},
  message: {
    send() {},
    edit() {},
    remove() {},
  },
  messages: {
    id: []
  },
  activeChannelorDMID: 'id'
}

activeTeamID: 'id'

*/


const DEFAULT_STATE = {
  teams: {},
  activeTeamID: null
}

export default function teams(state = DEFAULT_STATE, { type, ...action }) {
  switch (type) {
    case TEAM_ADD:
      return {...state, teams: {...state.teams, [action.team.team.id]: action.team }, activeTeamID: action.team.team.id }
    case ACTIVE_TEAM_CHANGE:
      return {...state, activeTeamID: action.activeTeamID }
    case ACTIVE_CHANNEL_OR_DM_CHANGE:
      return (() => {
        const { team, teams } = extractTeamfromTeams(action.team, state.teams)
        team.activeChannelorDMID = action.channel_or_dm_id
        return {...state, teams: {...teams, [action.team]: teamToChange } }
      })()
      break
    case NEW_MESSAGE:
      return (() => {
        const { team: messageTeam, message: { channel: messageChannel, ...message } } = action
        const { teams, team } = extractTeamfromTeams(messageTeam, state.teams)

        if (!team.messages[messageChannel]) {
          team.messages[messageChannel] = [message]
        } else {
          team.messages[messageChannel].push(message)
        }

        return {...state, teams: {...teams, [messageTeam]: team } }
      })()
    case EDIT_MESSAGE:
      return {...state }
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
