import moment from 'moment'
import crypto from 'crypto'

export function sanitizeRoomToChannel({ name, id, userCount, topic }) {
  return {
    id,
    isMember: true,
    name,
    main: false,
    members: userCount,
    meta: { topic }
  }
}

export function sanitizeRoomToDM({ user: { avatarUrlMedium, avatarUrlSmall, username, displayName, id: userID }, id }) {
  return {
    isOpen: true,
    id,
    presence: 'online',
    name: displayName,
    handle: username,
    image: avatarUrlMedium || avatarUrlSmall,
    user: userID,
    meta: { members: 'unknown', topic: displayName }
  }
}

export function santitizeUser({ username, displayName, id, avatarUrlSmall, avatarUrlMedium }) {
  return {
    id,
    handle: username,
    name: displayName,
    presence: 'unknown',
    images: [avatarUrlSmall, avatarUrlMedium],
    meta: {}
  }
}

export function santitizeMessage({ text, sent, fromUser: { id: userID, ...user }, ...message }, users) {
  let userProfile = null
  const parsedTime = moment(sent)

  if (!users[userID]) {
    userProfile = {
      name: user.displayName,
      handle: user.username,
      id: userID,
      image: user.avatarUrlMedium || user.avatarUrlSmall
    }
  }
  return {
    attachments: [],
    user: userID,
    text: text,
    userProfile,
    timestamp: parsedTime.unix(),
    friendlyTimestamp: parsedTime.format('h:mm a'),
    key: crypto.createHash('md5').update(JSON.stringify({ userID, text, sent })).digest('hex')
  }
}

export function parseMessage({ operation, model, channelID }, dontEmit = false) {
  switch (operation) {
    case 'create': {
      const message = {channel: channelID, ...santitizeMessage(model, this._datastore.users)}
      if (!dontEmit) {
        this.emit('message', message)
      }
      return message
    }
    default:
      return false
  }
}
