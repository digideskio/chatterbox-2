import React from 'react'
import ReactDOMServer from 'react-dom/server'
import moment from 'moment'
import _ from 'lodash'
import replace from 'frep'
import escapeStringRegexp from 'escape-string-regexp'
import annotations from 'emoji-annotation-to-unicode'
import styles from 'styles/chat.css'


export function santitizeUser({ tz: timezone, id, deleted, profile, name: handle, presence }) {
  return {
    handle,
    name: _.get(profile, 'real_name_normalized', '').length > 0 ? profile.real_name_normalized : null,
    id,
    presence,
    images: _.filter(profile, (data, key) => key.includes('image')),
    meta: { timezone, email: _.get(profile, 'email') }
  }
}

function santitizeAttachments(attachments) {
  return attachments.map(({ title, text, pretext, ...attachment }) => {
    return {
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
  return slackDown(text)
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

const codeBlockRegex = /(^|\s|[_*\?\.,\-!\^;:{(\[%$#+=\u2000-\u206F\u2E00-\u2E7F"])```([\s\S]*?)?```(?=$|\s|[_*\?\.,\-!\^;:})\]%$#+=\u2000-\u206F\u2E00-\u2E7F…"])/g
const codeRegex = /(^|\s|[\?\.,\-!\^;:{(\[%$#+=\u2000-\u206F\u2E00-\u2E7F"])`(.*?\S *)?`/g

const boldRegex = /(^|\s|[\?\.,\-!\^;:{(\[%$#+=\u2000-\u206F\u2E00-\u2E7F"])\*(.*?\S *)?\*(?=$|\s|[\?\.,'\-!\^;:})\]%$~{\[<#+=\u2000-\u206F\u2E00-\u2E7F…"\uE022])/g
const italicRegex = /(?!:.+:)(^|\s|[\?\.,\-!\^;:{(\[%$#+=\u2000-\u206F\u2E00-\u2E7F"])_(.*?\S *)?_(?=$|\s|[\?\.,'\-!\^;:})\]%$~{\[<#+=\u2000-\u206F\u2E00-\u2E7F…"\uE022])/g
const strikeRegex = /(^|\s|[\?\.,\-!\^;:{(\[%$#+=\u2000-\u206F\u2E00-\u2E7F"])~(.*? *\S)?~(?=$|\s|[\?\.,'\-!\^;:})\]%$~{\[<#+=\u2000-\u206F\u2E00-\u2E7F…"\uE022])/g
  // const quoteRegex = /(^|)&gt;(?![\W_](?:&lt;|&gt;|[\|\/\\\[\]{}\(\)Dpb](?=\s|$)))(([^]*)(&gt;[^]*)*)/g
  // const longQuote = /(^|)&gt;&gt;&gt;([\s\S]*$)/

const _buildImageUrl = (hex, ext = 'png') => `http://cdn.jsdelivr.net/emojione/assets/${ext}/${hex.toUpperCase()}.${ext}`
const _getKey = key => key.match(/^:.*:$/) ? key.replace(/^:/, '').replace(/:$/, '') : key
const _getEscapedKeys = hash => Object.keys(hash).map(x => escapeStringRegexp(x)).join('|')
const emojiWithEmoticons = { delimiter: new RegExp(`(:(?:${_getEscapedKeys(annotations)}):)`, 'g'), dict: annotations }


const replacements = [{ pattern: codeBlockRegex,
    replacement: (match) => {
      match = match.slice(3, -3)
      return match.trim().length > 0 ? ReactDOMServer.renderToStaticMarkup(<div className={styles['code-block']}>{match}</div>) : match
    }
  },
  {
    pattern: codeRegex,
    replacement: (match) => {
      match = match.slice(1, -1)
      return match.trim().length > 0 ? ReactDOMServer.renderToStaticMarkup(<div className={styles['code-inline']}>{match}</div>) : match
    }
  },
  {
    pattern: boldRegex,
    replacement: (match) => {
      match = match.slice(1, -1)
      return match.trim().length > 0 ? ReactDOMServer.renderToStaticMarkup(<b>{match}</b>) : match
    }
  },
  {
    pattern: italicRegex,
    replacement: (match) => {
      match = match.slice(1, -1)
      return match.trim().length > 0 ? ReactDOMServer.renderToStaticMarkup(<i>{match}</i>) : match
    }
  },
  {
    pattern: strikeRegex,
    replacement: (match) => {
      match = match.slice(1, -1)
      return match.trim().length > 0 ? ReactDOMServer.renderToStaticMarkup(<em>{match}</em>) : match
    }
  },
  {
    pattern: emojiWithEmoticons.delimiter,
    replacement: (match) => {
      const hex = emojiWithEmoticons.dict[_getKey(match)]
      return hex ? ReactDOMServer.renderToStaticMarkup(<img className={styles.emoji} src={_buildImageUrl(hex)} />) : match
    }
  }
]

function slackDown(text) {
  return replace.strWithArr(text, replacements)
}
