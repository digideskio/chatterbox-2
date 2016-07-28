import _ from 'lodash'

import { MESSAGES_ADD_HISTORY, MESSAGES_NEW_MESSAGE, MESSAGES_EDIT_MESSAGE } from 'actions/messages'

const defaultState = {

}

export default function messages(state = defaultState, { type, payload }) {
  switch (type) {
    case MESSAGES_ADD_HISTORY:
      return (() => {
        const messages = { ...state }
        const { team, channel } = payload
        _.update(messages, `${team}.${channel}`, (channel = []) => [...payload.messages, ...channel])
        return messages
      })()
    case MESSAGES_NEW_MESSAGE:
      return (() => {
        const messages = { ...state }
        const { team: msgTeam, channel: msgChannel, message } = payload
        _.update(messages, `${msgTeam}.${msgChannel}`, (channel = []) => [...channel, message])
        return messages
      })()
    case MESSAGES_EDIT_MESSAGE:
      return (() => {
        const messages = { ...state }
        const { team, channel, message, edit: { eventTimestamp, previousMessageTimestamp } } = payload
        const oldMsgIndex = _.findIndex(_.get(messages, `${team}.${channel}`, []), ['timestamp', previousMessageTimestamp])

        _.set(messages, `${team}.${channel}[${oldMsgIndex}]`, {
          ...message,
          isBot: false,
          edited: { timestamp: eventTimestamp }
        })
        return messages
      })()
    default:
      return state
  }
}
