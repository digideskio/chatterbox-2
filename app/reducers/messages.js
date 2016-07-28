import _ from 'lodash'

import { MESSAGES_ADD_HISTORY, MESSAGES_NEW_MESSAGE, MESSAGES_EDIT_MESSAGE } from 'actions/messages'

const defaultState = {/*
  [teamId]: {
    [channelId]: messages[]
  }
*/}

export default function messages(state = defaultState, { type, payload }) {
  switch (type) {
    case MESSAGES_ADD_HISTORY: {
      const newState = { ...state }
      const { team, channel, messages } = payload
      _.update(newState, `${team}.${channel}`, (channelMessages = []) => [...messages, ...channelMessages])
      return newState
    }
    case MESSAGES_NEW_MESSAGE: {
      const newState = { ...state }
      const { team, channel, message } = payload
      _.update(newState, `${team}.${channel}`, (channelMessages = []) => [...channelMessages, message])
      return newState
    }
    case MESSAGES_EDIT_MESSAGE: {
      const newState = { ...state }
      const { team, channel, message, edit: { eventTimestamp, previousMessageTimestamp } } = payload
      const oldMsgIndex = _.findIndex(_.get(newState, `${team}.${channel}`, []), ['timestamp', previousMessageTimestamp])

      _.set(newState, `${team}.${channel}[${oldMsgIndex}]`, {
        ...message,
        isBot: false,
        edited: { timestamp: eventTimestamp }
      })
      return newState
    }
    default:
      return state
  }
}
