import _ from 'lodash'

import { MESSAGES_ADD_HISTORY, MESSAGES_NEW_MESSAGE, MESSAGES_EDIT_MESSAGE, MESSAGES_HISTORY_LOADING, MESSAGES_MESSAGE_SENT } from 'actions/messages'

const defaultState = {/*
  [teamId]: {
    [channelId]: {
      isLoading: false,
      messages: []
    }
  }
*/}

export default function messages(state = defaultState, { type, payload }) {
  switch (type) {
    case MESSAGES_HISTORY_LOADING: {
      const newState = { ...state }
      const { channelID, teamID } = payload
      _.update(newState, `${teamID}.${channelID}`, ({messages = []} = {}) => ({
        messages,
        isLoading: true
      }))
      return newState
    }
    case MESSAGES_ADD_HISTORY: {
      const newState = { ...state }
      const { team, channel, messages } = payload
      _.update(newState, `${team}.${channel}`, ({messages: channelMessages = []} = {}) => ({
        messages: [...messages, ...channelMessages],
        isLoading: false
      }))
      return newState
    }
    case MESSAGES_NEW_MESSAGE: {
      const newState = { ...state }
      const { team, channel, message } = payload
      _.update(newState, `${team}.${channel}`, ({messages: channelMessages = [], isLoading} = {}) => ({
        messages: [...channelMessages, message],
        isLoading
      }))
      return newState
    }
    case MESSAGES_EDIT_MESSAGE: {
      const newState = { ...state }
      const { team, channel, message, edit, sendingID } = payload
      if(!sendingID) {
        const { eventTimestamp, previousMessageTimestamp } = edit
        message.edited = { timestamp: eventTimestamp }
      }
      const oldMsgIndex = _.findIndex(_.get(newState, `${team}.${channel}.messages`, []), [sendingID ? 'sendingID' : 'timestamp', sendingID || previousMessageTimestamp])
      _.set(newState, `${team}.${channel}.messages[${oldMsgIndex}]`, message)
      return newState
    }
    default:
      return state
  }
}
