export const TEAM_CHANGE = 'TEAM_CHANGE'
export const TEAMS_CHANGE = 'TEAMS_CHANGE'
export const CHANNEL_CHANGE = 'CHANNEL_CHANGE'
export const CHANNELS_CHANGE = 'CHANNELS_CHANGE'
export const USER_CHANGE = 'USER_CHANGE'
export const ICON_CHANGE = 'ICON_CHANGE'


export function setIcon(icon) {
  return { type: ICON_CHANGE, icon }
}

export function setTeam(team) {
  return { type: TEAM_CHANGE, team }
}
