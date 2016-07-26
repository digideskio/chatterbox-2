import {
  ACTIVE_TEAM_CHANGE,
  ACTIVE_CHANNEL_OR_DM_CHANGE,
  TEAM_ADD,
  TEAM_REMOVE,

  ADD_HISTORY,
  NEW_MESSAGE,
  MODIFY_MESSAGE,
  EDIT_MESSAGE,
  REMOVE_MESSAGE
} from 'actions/teams'


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
        return {...state, teams: {...teams, [action.team]: team } }
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
    case ADD_HISTORY:
      return (() => {
        const { messages, team: messagesTeam, channel: messagesChannel } = action
        const { teams, team } = extractTeamfromTeams(messagesTeam, state.teams)

        if (!team.messages) {
          team.messages = {}
        }

        if (!team.messages[messagesChannel]) {
          team.messages[messagesChannel] = messages
        } else {
          team.messages[messagesChannel] = [...team.messages[messagesChannel], ...messages]
        }

        return {...state, teams: {...teams, [messagesTeam]: team } }
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
