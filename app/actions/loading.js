export const LOADED_CHANGE = 'LOADED_CHANGE'
export const TASK_CHANGE = 'TASK_CHANGE'
export const TASK_DONE = 'TASK_DONE'

export function setTask(task) {
  return { type: TASK_CHANGE, task }
}

export function setTaskDone(task) {
  return { type: TASK_DONE, task }
}

export function setLoadedPercent(percent) {
  return { type: LOADED_CHANGE, loaded: percent }
}
