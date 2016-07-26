import {
  ACTIVE_TEAM_CHANGE,
  TEAM_ADD,
  TEAM_REMOVE,

  NEW_MESSAGE,
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

export default function settings(state = DEFAULT_STATE, { type, ...action }) {
  switch (type) {
    case TEAM_ADD:
      return {
        ...state,
        teams: { ...state.teams, [action.team.team.id]: action.team },
        activeTeamID: action.team.team.id
      }
    case ACTIVE_TEAM_CHANGE:
      return {...state, activeTeamID: action.activeTeamID }
    case NEW_MESSAGE:
      const { team: messageTeam, channel: messageChannel, ...message } = action.message
      const { [messageTeam]: teamToChange, ...teams } = state.teams

      if (!teamToChange.messages[messageChannel]) {
        teamToChange.messages[messageChannel] = [message]
      } else {
        teamToChange.messages[messageChannel].push(message)
      }

      return {...state, teams: {...teams, [messageTeam]: teamToChange } }
    case EDIT_MESSAGE:
      return {...state }
    default:
      return state
  }
}
