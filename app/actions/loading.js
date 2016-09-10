export const LOADING_LOADED_CHANGE = 'LOADING_LOADED_CHANGE'
export const LOADING_TASK_CHANGE = 'LOADING_TASK_CHANGE'

export function changeTask(payload) {
  return { type: LOADING_TASK_CHANGE, payload }
}

export function setLoadedPercent(payload) {
  return { type: LOADING_LOADED_CHANGE, payload }
}
