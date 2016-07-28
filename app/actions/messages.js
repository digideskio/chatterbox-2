export const ADD_HISTORY = 'MESSAGES_ADD_HISTORY'
export const SEND_MESSAGE = 'MESSAGES_SEND_MESSAGE'
export const NEW_MESSAGE = 'MESSAGES_NEW_MESSAGE'
export const EDIT_MESSAGE = 'MESSAGES_EDIT_MESSAGE'
export const REMOVE_MESSAGE = 'MESSAGES_REMOVE_MESSAGE'


export function sendMessage(teamID, channelID, message) {
  return (dispatch, getState) => {
    const { teams: { [teamID]: Team } } = getState().teams
    Team.message.send(channelID, message).then(() => {
      console.info('it sent.')
    }, console.error)
  }
}

export function newMessage(payload) {
  return { type: NEW_MESSAGE, payload }
}

export function editMessage(payload) {
  return { type: EDIT_MESSAGE, payload }
}

export function removeMessage(payload) {
  return { type: REMOVE_MESSAGE, payload }
}
