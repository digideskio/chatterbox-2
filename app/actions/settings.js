import Database from 'lib/database'
import * as LoadingActions from './loading'
import { bindActionCreators } from 'redux'

export const CHANGE = 'SETTINGS_CHANGE'
export const SET = 'SETTINGS_SET'
export const RESET = 'SETTINGS_RESET'


export function changeSetting(setting, value) {
  return (dispatch, getState) => {
    Database.settings.change(setting, value).then(() => {
      dispatch({ type: CHANGE, setting, value })
    })
  }
}

export function loadSettings() {
  return (dispatch, getState) => {
    const { setLoadedPercent, setTask, setTaskDone } = bindActionCreators(LoadingActions, dispatch)
    setTask('Loading settings')
    const loader = new Database.settings.Loader()
    loader.on('loaded', ({ setting, value }, percent) => {
      dispatch({ type: SET, [setting]: value })
      setLoadedPercent(percent)
    })
    loader.once('finnished', () => {
      dispatch({ type: SET, percent: 100 })
      setTaskDone('settings')
    })
  }
}
