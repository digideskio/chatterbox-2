import { LOADING_TASK_CHANGE, LOADING_LOADED_CHANGE } from 'actions/loading'

const DEFAULT_STATE = {
  percent: 0,
  task: ''
}

export default function loading(state = DEFAULT_STATE, { type, payload }) {
  switch (type) {
    case LOADING_LOADED_CHANGE:
      return { ...state, percent: payload }
    case LOADING_TASK_CHANGE:
      return { ...state, task: payload }
    default:
      return state
  }
}
