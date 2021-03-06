import React from 'react'
import crypto from 'crypto'
import uuid from 'node-uuid'
import moment from 'moment'
import _ from 'lodash'
import replace from 'frep'
import escapeStringRegexp from 'escape-string-regexp'
import annotations from 'emoji-annotation-to-unicode'
import ChatInlineUser from 'components/Chat/Message/Inline/User.react'
import ChatInlineChannel from 'components/Chat/Message/Inline/Channel.react'
import ChatInlineLink from 'components/Chat/Message/Inline/Link.react'

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
  return attachments.map((rawAttachment) => {
    const { title, text, pretext, color, fields, mrkdwn_in = [], ...attachment } = rawAttachment
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
        url: attachment.video_url ? attachment.video_url : attachment.from_url,
        height: attachment.video_html_height,
        width: attachment.video_html_width
      } : undefined,
      links: {
        author: attachment.author_link,
        title: formatText.bind(this)(attachment.title_link)
      },
      author: attachment.author_name,
      service: attachment.service_name,
      borderColor: color ? `#${color}` : undefined,
      title: formatText.bind(this)(title),
      pretext: mrkdwn_in.includes('pretext') ? formatText.bind(this)(pretext) : pretext,
      text: mrkdwn_in.includes('text') ? formatText.bind(this)(text) : text,
      fields: mrkdwn_in.includes('fields') ? _.map(fields, field => {
        field.value = formatText.bind(this)(field.value)
        return field
      }) : fields,
      key: crypto.createHash('md5').update(JSON.stringify(rawAttachment)).digest('hex')
    }
  })
}

function santitizeMessage({ user, text, ts: timestamp, user_profile: userProfile = null, attachments = [], edited = '' }) {
  return {
    attachments: santitizeAttachments.bind(this)(attachments),
    user,
    text: formatText.bind(this)(text),
    userProfile,
    timestamp,
    friendlyTimestamp: moment.unix(timestamp).format('h:mm a'),
    key: crypto.createHash('md5').update(JSON.stringify({ user, text, timestamp, attachments, edited })).digest('hex')
  }
}

export function parseMessage({ type, subtype, bot_id, channel = null, isSending = null, ...messageData }, dontEmit = false) {
  let isBot = Boolean(bot_id)
  let userProfileChecked = false
  switch (subtype ? `${type}:${subtype}` : type) {
    case 'message:bot_message':
      {
        isBot = true
        userProfileChecked = true
        const { images, icons, name: handle, id } = this._slack.dataStore.bots[bot_id]
        messageData.user_profile = { handle, id, image: _.last(_.filter((images || icons), (a, key) => key.includes('image'))) }
      }
    case 'message:file_share': // eslint-disable-line no-fallthrough
    case 'message':
      {
        if (messageData.user_profile && !userProfileChecked) {
          const { name: handle, real_name: name, ...user_profile } = messageData.user_profile
          messageData.user_profile = {
            image: _.last(_.filter(user_profile, (a, key) => key.includes('image') || key.includes('icon'))),
            handle,
            name
          }
        }

        const msg = _.omitBy({ channel, isBot, ...santitizeMessage.bind(this)(messageData), isSending }, _.isNil)
        if (!dontEmit) {
          this.emit('message', msg)
        }
        return msg
      }
    case 'message:message_changed':
      {
        const { message, event_ts: eventTimestamp, previous_message: { ts: previousMessageTimestamp } } = messageData
        const msg = {
          channel,
          message: santitizeMessage.bind(this)({
            ...message,
            edited: eventTimestamp
          }),
          edit: { eventTimestamp },
          previousMessageTimestamp
        }

        if (!dontEmit) {
          this.emit('message:changed', msg)
        }
        return msg
      }
    default:
      // console.info('Unable to parse message:', { type, subtype, ...messageData })
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


function reparseMatch(match, messageReplacementDict) {
  const delimiter = new RegExp(`(${_getEscapedKeys(messageReplacementDict)})`, 'g')
  return _.compact(
    match.split(delimiter).map((word, index) => {
      const [match] = word.match(delimiter) || []
      if (match && messageReplacementDict[match]) {
        word = messageReplacementDict[match]
        delete messageReplacementDict[match]
      }
      return word
    })
  )
}

function formatText(text) {
  if (!text) return text

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
          if (!url.match(/^(https?:\/\/)|(mailto:)/)) return match

          messageReplacementDict[replacement] = <ChatInlineLink url={url} label={label} />
          return replacement
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

          match = match.charAt(0) == '\n' ? match.substring(1) : match

          if (Object.keys(messageReplacementDict).length > 0) {
            match = reparseMatch(match, messageReplacementDict)
          }

          messageReplacementDict[replacement] = <div className='codeblock'>{match}</div>
          return replacement
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

          if (Object.keys(messageReplacementDict).length > 0) {
            match = reparseMatch(match, messageReplacementDict)
          }

          messageReplacementDict[replacement] = <span className='code'>{match}</span>
          return replacement
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
          return replacement
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
          return replacement
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
              return replacement
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
        const key = _getKey(match)
        const hex = emojiWithEmoticons.dict[key]
        if (hex) {
          const replacement = uuid.v1()
          messageReplacementDict[replacement] = <img className='emoji' title={key} src={_buildImageUrl(hex)} />
          return replacement
        }
        return match
      }
    }
  ]

  const formattedText = _.unescape(replace.strWithArr(text, replacements))
  if (_.isEmpty(messageReplacementDict)) return formattedText
  const delimiter = new RegExp(`(${_getEscapedKeys(messageReplacementDict)})`, 'g')
  return _.compact(
    formattedText.split(delimiter).map((word, index) => {
      const [match] = word.match(delimiter) || []
      return match ? (messageReplacementDict[match] || word) : word
    })
  )
}
