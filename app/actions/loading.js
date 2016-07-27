import { push as locationPush } from 'react-router-redux'
import { bindActionCreators } from 'redux'
import * as TeamsActions from './teams'
import Database from 'lib/database'
import createTeamHandler from 'lib/teamHandler'
import { SET as SETTINGS_SET } from './settings'

export const LOADED_CHANGE = 'LOADING_LOADED_CHANGE'
export const TASK_CHANGE = 'LOADING_TASK_CHANGE'

export function setTask(task) {
  return { type: TASK_CHANGE, task }
}

export function setLoadedPercent(percent) {
  return { type: LOADED_CHANGE, loaded: percent }
}

export function load() {
  return (dispatch) => {
    loadSettings(dispatch)
      .then(loadTeams.bind(this, dispatch))
      .then(teams => {
        if (!teams.length) {
          dispatch(locationPush('/login/slack'))
        } else {
          changeActiveTeam(teams[0].team.id)
          dispatch(locationPush('/chat'))
        }
      })
  }
}


function loadSettings(dispatch) {
  return new Promise((resolve, reject) => {
    dispatch({ type: TASK_CHANGE, task: 'Loading settings' })
    const loader = new Database.settings.Loader()
    loader.on('loaded', ({ setting, value }, percent) => {
      dispatch({ type: SETTINGS_SET, [setting]: value })
      dispatch({ type: LOADED_CHANGE, percent })
    })
    loader.once('finnished', () => {
      dispatch({ type: LOADED_CHANGE, percent: 100 })
      resolve()
    })
  })
}

function loadTeams(dispatch) {
  return new Promise((resolve, reject) => {
    dispatch({ type: TASK_CHANGE, task: 'Loading Teams' })
    const loader = new Database.teams.Loader()
    let [numTeams, loadedTeams] = [0, []]

    loader.on('team', ({ id, name, type, args }) => {
      const [{ loadTeam, changeActiveTeam }, TeamHandler] = [bindActionCreators(TeamsActions, dispatch), createTeamHandler(type)]
      const Team = new TeamHandler(args, dispatch, false)
      Team.once('connected', (TeamData) => {
        loadTeam(Team)
        loadedTeams.push(Team)
        if (numTeams === loadedTeams.length) {
          resolve(loadedTeams)
        }
      })
    })
    loader.once('finnished', (num) => {
      if (num === 0) {
        resolve([])
      } else {
        numTeams = num
      }
    })
  })
}
