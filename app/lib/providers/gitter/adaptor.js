import { EventEmitter } from 'events'
import GitterClient from 'node-gitter'
import _ from 'lodash'


export default class GitterHandler extends EventEmitter {
  constructor({ token }) {
    super()

    this._gitter = new GitterClient(token)
  }

  message = {
    send: (channelID, message) => {},
    edit: (channelID, messageID, editedMessage) => {},
    remove: (channelID, messageID) => {}
  }

  _canSend = false
  _connected = false

  _getHistoryByID({ channel_or_dm_id, count = 50, latest = null, oldest = 0 }) {

  }

  get channels() {

  }

  get dms() {

  }

  get team() {

  }

  get users() {

  }

  get user() {

  }

  get _persistenceData() {

  }
}
