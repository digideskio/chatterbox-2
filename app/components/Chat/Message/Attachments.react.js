import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'
import _ from 'lodash'
import styles from 'styles/chat.css'

/* var attachments = [{
  'author_icon': 'https://mdn.mozillademos.org/files/6457/mdn_logo_only_color.png',
  'author_link': 'https://developer.mozilla.org',
  'author_name': 'Mozilla Developer Network',
  'pretext': 'Hello lol',
  'fallback': 'Array.prototype.map(): The map() method creates a new array with the results of calling a provided function on every element…element in this array. <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map>',
  'text': 'The map() method creates a new array with the results of calling a provided function on every element…element in this array.',
  'thumb_url': 'https://mdn.mozillademos.org/files/6457/mdn_logo_only_color.png',
  'title': 'Array.prototype.map()',
  'title_link': 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map'
}]*/

export default class Attachments extends Component {
  static propTypes = {
    attachments: PropTypes.array.isRequired
  }

  _renderImage(imageURL) {

  }

  render() {
    console.log(this.props)
    return (
      <div className={styles.attachments}>
        {
          this.props.attachments.map((a, idx) => (
            <div key={idx + 1} className={styles.attachment}>
              <div className={styles.attachmentPretext}>{a.pretext}</div>
              <div className={classnames(styles.attachmentContainer, {[styles.withThumb]: a.thumb_url})}>
                <div className={styles.sidebar} style={{borderColor: a.color || 'grey'}} />
                <div className={styles.attachmentBody}>
                  {
                    a.author_name ? (
                      <div className={styles.authorBody}>
                        {a.author_icon ? <div className={styles.authImg} style={{backgroundImage: `url(${a.author_icon})`}}></div> : null}
                        <div className={styles.authName}>{a.author_name}</div>
                      </div>
                    ) : null
                  }
                  <div className={styles.text}>{_.unescape(a.text)}</div>
                </div>
                {a.thumb_url ? (
                  <div className={styles.thumbCont}>
                    <div className={styles.thumb} style={{backgroundImage: `url(${a.thumb_url})`}}></div>
                  </div>
                ) : null}
              </div>
            </div>
          ))
        }
      </div>
    )
  }
}
