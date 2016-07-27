import _ from 'lodash'
import { ADD_HISTORY, NEW_MESSAGE, MODIFY_MESSAGE, EDIT_MESSAGE, REMOVE_MESSAGE } from 'actions/messages'


export default function messages(state = {}, { type, payload }) {
  switch (type) {
    case ADD_HISTORY:
      return (() => {
        const messages = {...state }
        const { team, channel } = payload
        _.update(messages, `${team}.${channel}`, (channel = []) => {
          return [...payload.messages, ...channel]
        })
        return {...state, ...messages }
      })()
    case NEW_MESSAGE:
      return (() => {
        const messages = {...state }
        const { team: msgTeam, channel: msgChannel, message } = payload
        _.update(messages, `${msgTeam}.${msgChannel}`, (channel = []) => {
          return [...channel, message]
        })
        return {...state, ...messages }
      })()
    case EDIT_MESSAGE:
      return (() => {
        const messages = {...state }
        const { team: msgTeam, channel: msgChannel, message } = payload
        let channelHistory = _.get(messages, `${msgTeam}.${msgChannel}`)
        let oldMsg = _.find(channelHistory, (m) => { return m.timestamp == message.previousTimestamp })
        if (oldMsg) {
          oldMsg.edited = message.timestamp
          oldMsg.text = message.text
        }
        return { ...state, ...messages }
      })()
      default:
        return state
  }
}
