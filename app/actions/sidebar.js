export const TEAM_CHANGE = 'SIDEBAR_TEAM_CHANGE'
export const TEAMS_CHANGE = 'SIDEBAR_TEAMS_CHANGE'
export const CHANNEL_CHANGE = 'SIDEBAR_CHANNEL_CHANGE'
export const CHANNELS_CHANGE = 'SIDEBAR_CHANNELS_CHANGE'
export const USER_CHANGE = 'SIDEBAR_USER_CHANGE'
export const ICON_CHANGE = 'SIDEBAR_ICON_CHANGE'


export function setIcon(icon) {
  return { type: ICON_CHANGE, icon }
}

export function setTeam(team) {
  return { type: TEAM_CHANGE, team }
}
