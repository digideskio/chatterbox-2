import { push as locationPush } from 'react-router-redux'

import Database from 'lib/database'
import createTeamHandler from 'lib/teamHandler'
import * as TeamsActions from './teams'
import { setSetting } from './settings'

export const LOADING_LOADED_CHANGE = 'LOADING_LOADED_CHANGE'
export const LOADING_TASK_CHANGE = 'LOADING_TASK_CHANGE'

export function changeTask(task) {
  return { type: LOADING_TASK_CHANGE, task }
}

export function setLoadedPercent(percent) {
  return { type: LOADING_LOADED_CHANGE, loaded: percent }
}

export function load() {
  return (dispatch) => {
    loadSettings(dispatch)
      .then(loadTeams.bind(this, dispatch))
      .then(teamID => {
        if (!teamID) {
          dispatch(locationPush('/login/slack'))
        } else {
          console.log(TeamsActions.changeActiveTeam(teamID))
          dispatch(TeamsActions.changeActiveTeam(teamID))
          dispatch(locationPush('/chat'))
        }
      })
  }
}


function loadSettings(dispatch) {
  return new Promise((resolve, reject) => {
    dispatch({ type: LOADING_TASK_CHANGE, task: 'Loading settings' })
    const loader = new Database.settings.Loader()
    loader.on('loaded', ({ setting, value }, percent) => {
      dispatch(setSetting(setting, value))
      dispatch(setLoadedPercent(percent))
    })
    loader.once('finnished', () => {
      dispatch(setLoadedPercent(100))
      resolve()
    })
  })
}

function loadTeams(dispatch) {
  return new Promise((resolve, reject) => {
    dispatch(changeTask('Loading teams'))
    const loader = new Database.teams.Loader()
    let firstLoaded = false

    loader.on('team', ({ id, name, type, args }) => {
      const TeamHandler = createTeamHandler(type)
      const Team = new TeamHandler(args, dispatch, false)
      Team.once('connected', () => {
        global.App.teams[Team.team.id] = Team
        dispatch(TeamsActions.loadTeam(Team))
        if (!firstLoaded) {
          firstLoaded = true
          resolve(Team.team.id)
        }
      })
    })
    loader.once('finnished', (num) => {
      if (num === 0) {
        resolve(null)
      }
    })
  })
}
