import Database from 'lib/database'

export const CHANGE = 'CHANGE'
export const SET = 'SET'
export const RESET = 'RESET'


export function changeSetting(setting, value) {
  return (dispatch, getState) => {
    Database.settings.change(setting, value).then(() => {
      dispatch({ type: CHANGE, setting, value })
    })
  }
}

export function updateSettingsloaded(percent) {
  return { type: CHANGE, percent }
}

export function loadSettings() {
  return (dispatch, getState) => {
    const loader = new Database.settings.Loader()
    loader.on('loaded', ({ setting, value }, percent) => dispatch({ type: SET, [setting]: value, percent }))
    loader.once('finnished', () => dispatch({ type: SET, percent: 100 }))
  }
}
