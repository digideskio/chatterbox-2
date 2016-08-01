import React from 'react'
import uuid from 'node-uuid'
import moment from 'moment'
import _ from 'lodash'
import replace from 'frep'
import escapeStringRegexp from 'escape-string-regexp'
import annotations from 'emoji-annotation-to-unicode'
import ChatInlineUser from 'components/Chat/Message/Inline/User.react'
import ChatInlineChannel from 'components/Chat/Message/Inline/Channel.react'
import ChatInlineLink from 'components/Chat/Message/Inline/Link.react'
import styles from 'styles/chat.css'

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
  return attachments.map(({ title, text, pretext, color, fields, ...attachment }) => {
    return {
      original: { title, text, pretext, color, fields, ...attachment },
      images: {
        image: attachment.image_url ? {
          url: attachment.image_url,
          height: attachment.image_height,
          width: attachment.image_width,
          size: attachment.image_bytes
        } : undefined,
        thumb: attachment.thumb_url ? {
          url: attachment.thumb_url,
          height: attachment.thumb_height,
          width: attachment.thumb_width
        } : undefined,
        author: attachment.author_icon,
        service: attachment.service_icon
      },
      video: attachment.video_html ? {
        type: attachment.service_name,
        url: attachment.from_url,
        height: attachment.video_html_height,
        width: attachment.video_html_width
      } : undefined,
      links: {
        author: attachment.author_link,
        title: attachment.title_link
      },
      author: attachment.author_name,
      service: attachment.service_name,
      borderColor: color ? `#${color}` : undefined,
      title,
      pretext,
      text,
      fields
    }
  })
}

function santitizeMessage({ user, text, ts: timestamp, user_profile: userProfile = null, attachments = [] }) {
  return {
    attachments: santitizeAttachments(attachments),
    user,
    text: formatText.bind(this)(text),
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
    case 'message:file_share': // eslint-disable-line no-fallthrough
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

        const msg = _.omitBy({ channel, isBot, ...santitizeMessage.bind(this)(messageData) }, _.isNil)
        if (overrideEvent) return msg
        else this.emit('message', msg)
      })()
    case 'message:message_changed':
      return (() => {
        const { message, event_ts: eventTimestamp, previous_message: { ts: previousMessageTimestamp } } = messageData
        const msg = { channel, message: santitizeMessage.bind(this)(message), edit: { eventTimestamp, previousMessageTimestamp } }

        if (overrideEvent) return msg
        else this.emit('message:changed', msg)
      })()
    default:
      console.info('Unable to parse message:', { type, subtype, ...messageData })
      return false
  }
}

const codeBlockRegex = /(^|\s|[_*\?\.,\-!\^;:{(\[%$#+=\u2000-\u206F\u2E00-\u2E7F"])```([\s\S]*?)?```(?=$|\s|[_*\?\.,\-!\^;:})\]%$#+=\u2000-\u206F\u2E00-\u2E7F…"])/g
const codeRegex = /(^|\s|[\?\.,\-!\^;:{(\[%$#+=\u2000-\u206F\u2E00-\u2E7F"])`(.*?\S *)?`/g

const userOrChannelRegex = /<[#@]+(.*?)>/g
const urlRegex = /<(.*?)>/g
const boldRegex = /(^|\s|[\?\.,\-!\^;:{(\[%$#+=\u2000-\u206F\u2E00-\u2E7F"])\*(.*?\S *)?\*(?=$|\s|[\?\.,'\-!\^;:})\]%$~{\[<#+=\u2000-\u206F\u2E00-\u2E7F…"\uE022])/g
const italicRegex = /(?!:.+:)(^|\s|[\?\.,\-!\^;:{(\[%$#+=\u2000-\u206F\u2E00-\u2E7F"])_(.*?\S *)?_(?=$|\s|[\?\.,'\-!\^;:})\]%$~{\[<#+=\u2000-\u206F\u2E00-\u2E7F…"\uE022])/g
const strikeRegex = /(^|\s|[\?\.,\-!\^;:{(\[%$#+=\u2000-\u206F\u2E00-\u2E7F"])~(.*? *\S)?~(?=$|\s|[\?\.,'\-!\^;:})\]%$~{\[<#+=\u2000-\u206F\u2E00-\u2E7F…"\uE022])/g
  // const quoteRegex = /(^|)&gt;(?![\W_](?:&lt;|&gt;|[\|\/\\\[\]{}\(\)Dpb](?=\s|$)))(([^]*)(&gt;[^]*)*)/g
  // const longQuote = /(^|)&gt;&gt;&gt;([\s\S]*$)/

const _buildImageUrl = (hex, ext = 'png') => `http://cdn.jsdelivr.net/emojione/assets/${ext}/${hex.toUpperCase()}.${ext}`
const _getKey = key => key.match(/^:.*:$/) ? key.replace(/^:/, '').replace(/:$/, '') : key
const _getEscapedKeys = hash => Object.keys(hash).map(x => escapeStringRegexp(x)).join('|')
const emojiWithEmoticons = { delimiter: new RegExp(`(:(?:${_getEscapedKeys(annotations)}):)`, 'g'), dict: annotations }

function formatText(text) {
  const messageReplacementDict = {}
  const replacements = [{
      pattern: urlRegex,
      replacement: (match) => {
        match = match.trim().slice(1, -1)
        if (match.length > 0) {
          const replacement = uuid.v1()
          if (match.charAt(0) == '@' || match.charAt(0) == '#') return `<${match}>`
          let split = match.split('|')
          let label = split.length === 2 ? split[1] : split[0]
          let url = split[0]
          if (!url.match(/^https?:\/\//)) return match

          messageReplacementDict[replacement] = <ChatInlineLink url={url} label={label} />
          return ` ${replacement}`
        }
        return match
      }
    },
    {
      pattern: codeBlockRegex,
      replacement: (match) => {
        match = match.trim().slice(3, -3)
        if (match.length > 0) {
          const replacement = uuid.v1()
          messageReplacementDict[replacement] = <div className={styles['code-block']}>{match}</div>
          return ` ${replacement}`
        }
        return match
      }
    },
    {
      pattern: codeRegex,
      replacement: (match) => {
        match = match.trim().slice(1, -1)
        if (match.length > 0) {
          const replacement = uuid.v1()
          messageReplacementDict[replacement] = <span className={styles['code-inline']}>{match}</span>
          return ` ${replacement}`
        }
        return match
      }
    },
    {
      pattern: boldRegex,
      replacement: (match) => {
        match = match.trim().slice(1, -1)
        if (match.length > 0) {
          const replacement = uuid.v1()
          messageReplacementDict[replacement] = <b>{match}</b>
          return ` ${replacement}`
        }
        return match
      }
    },
    {
      pattern: italicRegex,
      replacement: (match) => {
        match = match.trim().slice(1, -1)
        if (match.length > 0) {
          const replacement = uuid.v1()
          messageReplacementDict[replacement] = <i>{match}</i>
          return ` ${replacement}`
        }
        return match
      }
    },
    {
      pattern: strikeRegex,
      replacement: (match) => {
        match = match.trim().slice(1, -1)
        if (match.length > 0) {
          const replacement = uuid.v1()
          messageReplacementDict[replacement] = <em>{match}</em>
          return ` ${replacement}`
        }
        return match
      }
    },
    {
      pattern: userOrChannelRegex,
      replacement: (match) => {
        match = match.trim()
        if (match.length > 0) {
          const replacement = uuid.v1()
          if (match.includes('<@')) {
            const user = match.replace(/<|>/g, '')
            const isValidUser = this.users[user.replace('@', '')]
            if (isValidUser) {
              messageReplacementDict[replacement] = (
                <ChatInlineUser
                  isPing={this.user.id === isValidUser.id}
                  {...isValidUser}
                />
              )
              return ` ${replacement}`
            }
            return match
          } else {
            const channel = match.replace(/<|>|#/g, '')
            const isValidChannel = this.channels[channel]
            if (isValidChannel) {
              messageReplacementDict[replacement] = <ChatInlineChannel {...isValidChannel} />
              return ` ${replacement}`
            }
            return match
          }
        }
        return match
      }
    }, {
      pattern: emojiWithEmoticons.delimiter,
      replacement: (match) => {
        const hex = emojiWithEmoticons.dict[_getKey(match)]
        if (hex) {
          const replacement = uuid.v1()
          messageReplacementDict[replacement] = <img className={styles.emoji} src={_buildImageUrl(hex)} />
          return ` ${replacement}`
        }
        return match
      }
    }
  ]

  const formattedText = replace.strWithArr(text, replacements)
  const delimiter = new RegExp(`(${_getEscapedKeys(messageReplacementDict)})`, 'g')
  return _.compact(
    formattedText.split(delimiter).map((word, index) => {
      const [match] = word.match(delimiter) || []
      if (match) {
        return messageReplacementDict[match] || word
      } else {
        return word
      }
    })
  )
}
