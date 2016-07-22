import { TASK_CHANGE, LOADED_CHANGE } from 'actions/loading'

const DEFAULT_STATE = { loaded: 0, task: '' }

export default function loading(state = DEFAULT_STATE, { type, ...action }) {
  switch (type) {
    case TASK_CHANGE:
      return {...state, task: action.task }
    case LOADED_CHANGE:
      return {...state, loaded: action.loaded }
    default:
      return state
  }
}
