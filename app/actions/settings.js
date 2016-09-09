import Database from 'lib/database'

export const SETTINGS_CHANGE = 'SETTINGS_CHANGE'
export const SETTINGS_SET = 'SETTINGS_SET'
export const SETTINGS_RESET = 'SETTINGS_RESET'


export function changeSetting(setting, value) {
  return (dispatch) => {
    Database.settings.change(setting, value).then(() =>
      dispatch({ type: SETTINGS_CHANGE, setting, value })
    )
  }
}

export function setSetting(setting, value) {
  return { type: SETTINGS_SET, setting, value }
}

export function resetSettings() {
  return { type: SETTINGS_RESET }
}
