import _ from 'lodash'
import { ADD_HISTORY, NEW_MESSAGE, MODIFY_MESSAGE, EDIT_MESSAGE, REMOVE_MESSAGE } from 'actions/messages'


export default function messages(state = {}, { type, payload }) {
  switch (type) {
    case ADD_HISTORY:
      return (() => {
        const messages = {...state }
        const { team, channel } = payload
        _.update(messages, `${team}.${channel}`, (channel = []) => [...payload.messages, ...channel])
        return messages
      })()
    case NEW_MESSAGE:
      return (() => {
        const messages = {...state }
        const { team: msgTeam, channel: msgChannel, message } = payload
        _.update(messages, `${msgTeam}.${msgChannel}`, (channel = []) => [...channel, message])
        return messages
      })()
    case EDIT_MESSAGE:
      return (() => {
        const messages = {...state }
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
