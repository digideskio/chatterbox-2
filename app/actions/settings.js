import Database from 'lib/database'

export const CHANGE = 'SETTINGS_CHANGE'
export const SET = 'SETTINGS_SET'
export const RESET = 'SETTINGS_RESET'


export function changeSetting(setting, value) {
  return (dispatch) => {
    Database.settings.change(setting, value).then(() => {
      dispatch({ type: CHANGE, setting, value })
    })
  }
}
