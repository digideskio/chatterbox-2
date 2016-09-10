import Database from 'lib/database'
import { loadTeams } from 'actions/teams'
import { setLoadedPercent } from './loading'

export const SETTINGS_LOAD = 'SETTINGS_LOAD'
export const SETTINGS_LOAD_SUCCESS = 'SETTINGS_LOAD_SUCCESS'
export const SETTINGS_LOAD_FAIL = 'SETTINGS_LOAD_FAIL'

export const SETTINGS_CHANGE = 'SETTINGS_CHANGE'
export const SETTINGS_SET = 'SETTINGS_SET'
export const SETTINGS_RESET = 'SETTINGS_RESET'


export function loadSettings() {
  return {
    types: [SETTINGS_LOAD, SETTINGS_LOAD_SUCCESS, SETTINGS_LOAD_FAIL],
    promise: (dispatch, getState) => new Promise((resolve, reject) => {
      const loader = new Database.settings.Loader()
      loader.on('loaded', ({ setting, value }, percent) => {
        dispatch(setSetting(setting, value))
        dispatch(setLoadedPercent(percent))
      })
      loader.once('finnished', () => {
        resolve()
        dispatch(loadTeams())
      })
    })
  }
}

export function changeSetting(setting, value) {
  return dispatch => Database.settings.change(setting, value).then(() =>
    dispatch({ type: SETTINGS_CHANGE, setting, value })
  )
}

export function setSetting(setting, value) {
  return { type: SETTINGS_SET, setting, value }
}

export function resetSettings() {
  return { type: SETTINGS_RESET }
}
