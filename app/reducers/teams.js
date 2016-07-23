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
  }
}

activeTeam: {
  id: null,
  channel: null,
  dm: null
}

*/


const DEFAULT_STATE = {
  teams: {},
  activeTeam: {}
}

export default function settings(state = DEFAULT_STATE, { type, ...action }) {
  switch (type) {
    case ACTIVE_TEAM_CHANGE:
      return {...state, activeTeam: {...state.activeTeam, ...action.activeTeam } }
    case NEW_MESSAGE:
      return {...state }
    case EDIT_MESSAGE:
      return {...state }
    default:
      return state
  }
}
