import React from 'react'
import escapeStringRegexp from 'escape-string-regexp'
import annotations from 'emoji-annotation-to-unicode'
import { compact } from 'lodash'
import styles from 'styles/chat.css'

const getKey = key => key.match(/^:.*:$/) ? key.replace(/^:/, '').replace(/:$/, '') : key
const getEscapedKeys = hash => Object.keys(hash).map(x => escapeStringRegexp(x)).join('|')


const emojiWithEmoticons = {
  delimiter: new RegExp(`(:(?:${getEscapedKeys(annotations)}):)`, 'g'),
  dict: annotations
}

function buildImageUrl(hex, ext) {
  return `http://cdn.jsdelivr.net/emojione/assets/${ext}/${hex.toUpperCase()}.${ext}`
}

export default function emojify(text, { ext = 'png' } = {}, customEmojiMap) {
  let { delimiter, dict } = emojiWithEmoticons
  if (customEmojiMap) Object.assign(dict, customEmojiMap)

  return compact(
    text.split(delimiter).map((word, index) => {
      const [match] = word.match(delimiter) || []
      if (match) {
        const hex = dict[getKey(match)]
        return hex ? <img className={styles.emoji} src={buildImageUrl(hex, ext)} key={index + 1} /> : word
      } else {
        return word
      }
    })
  )
}
