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
  users: [],
  channels: [],
  messages: {
    channelID: []
  },
  dms: [],
  message: {
    send() {},
    edit() {},
    remove() {},
  },
  history: {
    channels: {
      id: []
    },
    dms: {}
  },
  activeChannelorDMID: 'id'
}

activeTeamID: 'id'

*/


const DEFAULT_STATE = {
  teams: [],
  activeTeamID: null
}

export default function settings(state = DEFAULT_STATE, { type, ...action }) {
  switch (type) {
    case TEAM_ADD:
      return {...state, teams: [...state.teams, action.team], activeTeamID: action.team.team.id }
    case ACTIVE_TEAM_CHANGE:
      return {...state, activeTeamID: action.activeTeamID }
    case NEW_MESSAGE:
      const { team, channel, message } = action
      return {...state }
    case EDIT_MESSAGE:
      return {...state }
    default:
      return state
  }
}
