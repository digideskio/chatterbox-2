import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'
// import prettyBytes from 'pretty-bytes'
import ImageLoader from 'react-imageloader'
import styles from 'styles/chat.css'

/* var attachments = [{
  author: '',
  images: {
    image: {
      url: '',
      width: x,
      height: x,
      size: x
    },
    thumb: {
      url: '',
      width: x,
      height: x
    },
    author: '',
    service: ''
  },
  links: {
    title,
    author
  },
  video: {
    url: '',
    width: x,
    height: x,
    type: ''
  },
  title: '',
  pretext: '',
  text: '',
  fields: [],
  color: '',
  service: ''
}]*/

export default class Attachments extends Component {
  static propTypes = {
    attachments: PropTypes.array.isRequired
  }

  _renderImage(image) {
    let { width, height } = image
    if (width && height) {
      if (width > 400) {
        width = 400
        height = image.height * (width / image.width)
      }
      if (height > 475) {
        height = 475
        width = image.width * (height / image.height)
      }
    } else {
      width = 200
      height = 300
    }
    return (
      <div className={styles.bigImage}>
        <ImageLoader src={image.url} style={{ width: `${width}px`, height: `${height}px` }} />
      </div>
    )
  }

  _renderAuthor(author, authorLink, authorImage, service, serviceImage) {
    return (
      <div className={styles.authorBody}>
        {serviceImage ? <div className={styles.authImg} style={{backgroundImage: `url(${serviceImage})`}}></div> : null}
        {service ? <div className={styles.servName}>{service} |</div> : null}
        {authorImage ? <div className={styles.authImg} style={{backgroundImage: `url(${authorImage})`}}></div> : null}
        {author ? <div className={styles.authName}>{author}</div> : null}
      </div>
    )
  }

  _renderThumb(thumbURL) {
    return (
      <div className={styles.thumbCont}>
        <div className={styles.thumb} style={{backgroundImage: `url(${thumbURL})`}}></div>
      </div>
    )
  }

  // Remove links for dev only
  _sanitizeText(text) {
    return text.replace(/<.+\|/g, ' [LINK REMOVED]')
  }

  _renderAttachments({ text, borderColor = 'gray', pretext, title, links = {}, images = {}, video, author, service, fields }) {
    console.log(text, borderColor, pretext, title, links, images, video, author, service, fields)
    let attachments = true
    if (!text && !pretext && !title && !images.thumb && !video && !author && !fields) attachments = false

    return (
      <div>
        {pretext ? <div className={styles.attachmentPretext}>{this._sanitizeText(pretext)}</div> : null}
        <div className={classnames(styles.attachmentContainer, {[styles.withThumb]: images.thumb}, {[styles.noColorBar]: !attachments})}>
          <div className={styles.sidebar} style={{borderColor}}></div>
          {author || text || service
            ? <div className={styles.attachmentBody}>
              {author ? this._renderAuthor(author, links.author, images.author, service, images.service) : null}
              {text ? <div className={styles.text}>{this._sanitizeText(text)}</div> : null}
            </div>
          : null}
          {images.thumb ? this._renderThumb(images.thumb) : null}
          {images.image ? this._renderImage(images.image) : null}
        </div>
      </div>
    )
  }

  render() {
    return (
      <div className={styles.attachments}>
        {
          this.props.attachments.map((attachment, idx) => (
            <div key={idx + 1} className={styles.attachment}>
              {this._renderAttachments(attachment)}
            </div>
          ))
        }
      </div>
    )
  }
}
