import { combineReducers } from 'redux'

import { LOADING_TASK_CHANGE, LOADING_LOADED_CHANGE } from 'actions/loading'

const DEFAULT_STATE = {
  loaded: 0,
  task: ''
}

function loaded(state = DEFAULT_STATE.loaded, action) {
  if (action.type === LOADING_LOADED_CHANGE) {
    return action.loaded
  }
  return state
}

function task(state = DEFAULT_STATE.task, action) {
  if (action.type === LOADING_TASK_CHANGE) {
    return action.task
  }
  return state
}

export default combineReducers({
  loaded,
  task
})
