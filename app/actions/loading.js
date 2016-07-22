export const LOADED_CHANGE = 'LOADED_CHANGE'
export const TASK_CHANGE = 'TASK_CHANGE'

export function setTask(task) {
  return { type: TASK_CHANGE, task }
}

export function setLoadedPercent(percent) {
  return { type: LOADED_CHANGE, loaded:percent }
}
