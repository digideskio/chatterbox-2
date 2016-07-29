import moment from 'moment'
import _ from 'lodash'
import emojify from '../emojify'


export function santitizeUser({ tz: timezone, id, deleted, profile, name: handle, presence }) {
  return {
    handle,
    name: _.get(profile, 'real_name_normalized', '').length > 0 ? profile.real_name_normalized : null,
    id,
    presence: presence === 'active' ? 'online' : 'offline',
    images: _.filter(profile, (data, key) => key.includes('image')),
    meta: { timezone, email: _.get(profile, 'email') }
  }
}

function santitizeAttachments(attachments) {
  return attachments.map(({ title, text, pretext, ...attachment }) => {
    return {
      original: { title, text, pretext, ...attachment },
      images: { thumb: attachment.thumb_url, author: attachment.author_icon },
      links: { author: attachment.author_link, title: attachment.title_link },
      author: attachment.author_name,
      title,
      pretext,
      text
    }
  })
}

function formatText(text) {
  let formatText = emojify(text)
  return formatText
}

function santitizeMessage({ user, text, ts: timestamp, user_profile: userProfile = null, attachments = [] }) {
  return {
    attachments: santitizeAttachments(attachments),
    user,
    text: formatText(text),
    userProfile,
    timestamp,
    friendlyTimestamp: moment.unix(timestamp).format('h:mm a')
  }
}

export function parseMessage({ type, subtype, bot_id, channel = null, ...messageData }, overrideEvent = false) {
  let isBot = Boolean(bot_id)
  let userProfileChecked = false
  switch (subtype ? `${type}:${subtype}` : type) {
    case 'message:bot_message':
      (() => {
        isBot = true
        userProfileChecked = true
        const { images, icons, name: handle, id } = this._slack.dataStore.bots[bot_id]
        messageData.user_profile = { handle, id, image: _.last(_.filter((images || icons), (a, key) => key.includes('image'))) }
      })()
    case 'message:file_share':
    case 'message':
      return (() => {
        if (messageData.user_profile && !userProfileChecked) {
          const { name: handle, real_name: name, ...user_profile } = messageData.user_profile
          messageData.user_profile = {
            image: _.last(_.filter(user_profile, (a, key) => key.includes('image') || key.includes('icon'))),
            handle,
            name
          }
        }

        const msg = _.omitBy({ channel, isBot, ...santitizeMessage(messageData) }, _.isNil)
        if (overrideEvent) return msg
        else this.emit('message', msg)
      })()
    case 'message:message_changed':
      return (() => {
        const { message, event_ts: eventTimestamp, previous_message: { ts: previousMessageTimestamp } } = messageData
        const msg = { channel, message: santitizeMessage(message), edit: { eventTimestamp, previousMessageTimestamp } }

        if (overrideEvent) return msg
        else this.emit('message:changed', msg)
      })()
    default:
      console.info('Unable to parse message:', { type, subtype, ...messageData })
      return false
  }
}
