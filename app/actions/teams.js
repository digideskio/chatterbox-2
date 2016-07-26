import _ from 'lodash'

export const ACTIVE_TEAM_CHANGE = 'ACTIVE_TEAM_CHANGE'
export const TEAM_ADD = 'TEAM_ADD'
export const TEAM_CHANGE = 'TEAM_CHANGE'
export const TEAM_REMOVE = 'TEAM_REMOVE'

export const NEW_MESSAGE = 'NEW_MESSAGE'
export const EDIT_MESSAGE = 'EDIT_MESSAGE'
export const REMOVE_MESSAGE = 'REMOVE_MESSAGE'



export function addTeam(Handler) {
  return (dispatch, getState) => {
    Handler.history.load(_.find(Handler.channels, 'main').id)
      .then(history => {
        console.log(history)
      })
  }
}

export function removeTeam(team) {
  return { type: TEAM_REMOVE, team }
}

export function changeTeam(team) {
  return { type: TEAM_CHANGE, team }
}

export function changeActiveTeam(team) {
  return { type: ACTIVE_TEAM_CHANGE, team }
}


export function newMessage(message) {
  return { type: NEW_MESSAGE, message }
}

export function editMessage(message) {
  return { type: EDIT_MESSAGE, message }
}

export function removeMessage(message) {
  return { type: REMOVE_MESSAGE, message }
}
