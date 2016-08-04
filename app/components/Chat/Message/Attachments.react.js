import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'
import _ from 'lodash'

import ThumbImage from './Attachments/ThumbImage.react'
import Image from './Attachments/Image.react'
import Video from './Attachments/Video.react'
import Text from './Attachments/Text.react'
import Author from './Attachments/Author.react'

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
    attachments: PropTypes.array.isRequired,
    checkScroll: PropTypes.func.isRequired
  }

  _renderAttachments({ text, borderColor = 'gray', pretext, title, links = {}, images = {}, video, author, service, fields }) {
    // console.log(text, borderColor, pretext, title, links, images, video, author, service, fields)
    const renderSidebar = !(!text && !pretext && !title && !images.thumb && !video && !author && !fields)

    return (
      <div>
        {pretext ? <Text text={pretext} /> : null}

        <div className={classnames('attachment-container', {withThumb: images.thumb})}>
          {renderSidebar ? <div className='attachment-sidebar' style={{borderColor}} /> : null}

          {(author || text || service) ? (
            <div className='attachment-body'>
              {author ? (
                <Author
                  name={author}
                  image={images.author}
                  link={links.author}
                  service={{ name: service, image: images.service }}
                />
              ) : null}
              {text ? <Text isPretext={false} text={text} /> : null}
              {video ? (
                <Video
                  url={video.url}
                  height={video.height}
                  width={video.width}
                  type={video.type}
                />
              ) : null}
            </div>
          ) : null}

          {images.thumb && !video ? <ThumbImage url={images.thumb.url} /> : null}
          {images.image ? (
            <Image
              url={_.get(images.image, 'url')}
              {..._.pick(images.image, ['width', 'height'])}
            />
          ) : null}

        </div>
      </div>
    )
  }

  render() {
    return (
      <div className='attachments'>
        {
          this.props.attachments.map(({key, ...attachment}, idx) => (
            <div key={key} className='attachment'>
              {this._renderAttachments(attachment)}
            </div>
          ))
        }
      </div>
    )
  }
}
