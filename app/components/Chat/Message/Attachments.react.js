import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'
import _ from 'lodash'

/* var attachments = [{
  author: '',
  images: {
    thumb, author, ...images
  },
  links: {
    title, author
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
      <div className='authorBody'>
        {authorImage ? <div className='authImg' style={{backgroundImage: `url(${authorImage})`}}></div> : null}
        <div className='authName'>{name}</div>
      </div>
    )
  }

  _renderThumb(thumbURL) {
    return (
      <div className='thumbCont'>
        <div className='thumb' style={{backgroundImage: `url(${thumbURL})`}}></div>
      </div>
    )
  }

  // Remove links for dev only
  _sanitizeText(text) {
    return text.replace(/<.+\|/g, ' [LINK REMOVED]')
  }

  render() {
    return (
      <div className='attachments'>
        {
          this.props.attachments.map(({text, color: borderColor = 'gray', pretext, title, links = {}, images = {}, author}, idx) => (
            <div key={idx + 1} className='attachment'>
              {pretext ? <div className='attachmentPretext'>{_.unescape(this._sanitizeText(pretext))}</div> : null}

              <div className={classnames('attachmentContainer', {withThumb: images.thumb})}>
                <div className='sidebar' style={{borderColor}} />
                <div className='attachmentBody'>

                  {author ? this._renderAuthor(author, links.author, images.author) : null}

                  {text ? <div className='text'>{_.unescape(this._sanitizeText(text))}</div> : null}
                </div>
                {images.thumb ? this._renderThumb(images.thumb) : null}
              </div>
            </div>
          ))
        }
      </div>
    )
  }
}
