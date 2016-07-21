import { TEAM_CHANGE, TEAMS_CHANGE, CHANNEL_CHANGE, CHANNELS_CHANGE, USER_CHANGE, ICON_CHANGE } from '../actions/sidebar'

const DEFAULT_STATE = {
  icon: null,
  channels: [],
  activeChannelID: null,
  user: { name: null, handle: null, isOnline: true },
  activeTeamID: null,
  teams: []
}


export default function sidebar(state = DEFAULT_STATE, { type, ...action }) {
  switch (type) {
    case CHANNELS_CHANGE:
      return {...state, channels: action.channels }
    case CHANNEL_CHANGE:
      return {...state, activeChannelID: action.channelID }
    case USER_CHANGE:
      return {...state, user: action.user }
    case ICON_CHANGE:
      return {...state, icon: action.icon }
    case TEAMS_CHANGE:
      return {...state, teams: action.teams }
    case TEAM_CHANGE:
      return {...state, team: action.team }
    default:
      return state
  }
}
