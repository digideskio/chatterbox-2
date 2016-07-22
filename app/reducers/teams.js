import {
  ACTIVE_TEAM_CHANGE,
  TEAM_ADD,
  TEAM_REMOVE,

  NEW_MESSAGE,
  EDIT_MESSAGE,
  REMOVE_MESSAGE
} from 'actions/teams'

const DEFAULT_STATE = {
  teams: {
    id: {
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
  },
  activeTeam: {
    id: null,
    channel: null,
    dm: null
  }
}

export default function settings(state = DEFAULT_STATE, { type, ...action }) {
  switch (type) {
    case ACTIVE_TEAM_CHANGE:
      return {...state, activeTeamID: action.activeTeamID }
    case NEW_MESSAGE:
      return {...state }
    case EDIT_MESSAGE:
      return {...state }
    default:
      return state
  }
}
