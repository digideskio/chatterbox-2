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
    meta: { members: 'online', topic: displayName }
  }
}

export function santitizeUser({ username, displayName, id, avatarUrlSmall, avatarUrlMedium }) {
  return {
    id,
    handle: username,
    name: displayName,
    presence: 'online',
    images: [avatarUrlSmall, avatarUrlMedium],
    meta: {}
  }
}

export function santitizeMessage({ text, sent, fromUser: { id: userID } }) {
  const parsedTime = moment(sent)
  return {
    attachments: [],
    user: userID,
    text: text,
    timestamp: parsedTime.unix(),
    friendlyTimestamp: parsedTime.format('h:mm a'),
    key: crypto.createHash('md5').update(JSON.stringify({ userID, text, sent })).digest('hex')
  }
}
