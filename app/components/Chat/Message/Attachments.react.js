import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'
import _ from 'lodash'
import styles from 'styles/chat.css'

/* var attachments = [{
  author: '',
  images: {
    thumb, author, ...images
  },
  links: {
    thumb, title, author
  },
  title: '',
  'pretext': 'Hello lol',
  'text': 'The map() method creates a new array with the results of calling a provided function on every element…element in this array.'
}]*/

export default class Attachments extends Component {
  static propTypes = {
    attachments: PropTypes.array.isRequired
  }

  _renderImage(imageURL) {

  }

  _renderAuthor(name, authorLink, authorImage) {
    return (
      <div className={styles.authorBody}>
        {authorImage ? <div className={styles.authImg} style={{backgroundImage: `url(${authorImage})`}}></div> : null}
        <div className={styles.authName}>{name}</div>
      </div>
    )
  }

  _renderThumb() {
    return null
  }

  render() {
    return (
      <div className={styles.attachments}>
        {
          this.props.attachments.map(({text, color: borderColor = 'gray', pretext, title, links = {}, images = {}, author}, idx) => (
            <div key={idx + 1} className={styles.attachment}>
              {pretext ? <div className={styles.attachmentPretext}>{pretext}</div> : null}

              <div className={classnames(styles.attachmentContainer, {[styles.withThumb]: (links.thumb && images.thumb)})}>
                <div className={styles.sidebar} style={{borderColor}} />
                <div className={styles.attachmentBody}>

                  {author ? this._renderAuthor(author, links.author, images.author) : null}

                  {text ? <div className={styles.text}>{_.unescape(text)}</div> : null}
                </div>
              </div>
            </div>
          ))
        }
      </div>
    )
  }
}
