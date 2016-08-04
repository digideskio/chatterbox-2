export const MESSAGES_ADD_HISTORY = 'MESSAGES_ADD_HISTORY'
export const MESSAGES_SEND_MESSAGE = 'MESSAGES_SEND_MESSAGE'
export const MESSAGES_NEW_MESSAGE = 'MESSAGES_NEW_MESSAGE'
export const MESSAGES_EDIT_MESSAGE = 'MESSAGES_EDIT_MESSAGE'
export const MESSAGES_REMOVE_MESSAGE = 'MESSAGES_REMOVE_MESSAGE'


export function requestHistory(startTimestamp, endTimestamp, channel, teamID, amount = 50) {
  return (dispatch, getState) => {
    const { teams: { [teamID]: { history: { request: requestHistory } } } } = getState().teams
    requestHistory(startTimestamp, endTimestamp, channel, amount)
  }
}

export function addHistory(payload) {
  return { type: MESSAGES_ADD_HISTORY, payload }
}

export function newMessage(payload) {
  return { type: MESSAGES_NEW_MESSAGE, payload }
}

export function sendMessage(teamID, channelID, message) {
  return (dispatch, getState) => {
    const { teams: { [teamID]: Team } } = getState().teams
    Team.message.send(channelID, message).then(() => {
      console.info('it sent.')
    }, console.error)
  }
}

export function editMessage(payload) {
  return { type: MESSAGES_EDIT_MESSAGE, payload }
}

export function removeMessage(payload) {
  return { type: MESSAGES_REMOVE_MESSAGE, payload }
}
