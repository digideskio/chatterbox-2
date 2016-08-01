import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'
import ImageLoader from 'react-imageloader'

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
      <div className='bigImage'>
        <ImageLoader src={image.url} style={{ width: `${width}px`, height: `${height}px` }} />
      </div>
    )
  }

  _renderAuthor(author, authorLink, authorImage, service, serviceImage) {
    return (
      <div className='author-body'>
        {serviceImage ? <div className='auth-img' style={{backgroundImage: `url(${serviceImage})`}}></div> : null}
        {service ? <div className='serv-name'>{service} |</div> : null}
        {authorImage ? <div className='auth-img' style={{backgroundImage: `url(${authorImage})`}}></div> : null}
        {author ? <div className='auth-name'>{author}</div> : null}
      </div>
    )
  }

  _renderThumb(thumbURL) {
    return (
      <div className='thumb-cont'>
        <div className='thumb' style={{backgroundImage: `url(${thumbURL})`}}></div>
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
        {pretext ? <div className='attachment-pretext'>{this._sanitizeText(pretext)}</div> : null}
        <div className={classnames('attachment-container', {withThumb: images.thumb}, {noColorBar: !attachments})}>
          <div className='attachment-sidebar' style={{borderColor}}></div>
          {author || text || service
            ? <div className='attachment-body'>
              {author ? this._renderAuthor(author, links.author, images.author, service, images.service) : null}
              {text ? <div className='text'>{this._sanitizeText(text)}</div> : null}
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
      <div className='attachments'>
        {
          this.props.attachments.map((attachment, idx) => (
            <div key={idx + 1} className='attachment'>
              {this._renderAttachments(attachment)}
            </div>
          ))
        }
      </div>
    )
  }
}
