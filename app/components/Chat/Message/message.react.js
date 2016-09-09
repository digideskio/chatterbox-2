import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'
import Attachments from './Attachments.react'

export default class Message extends Component {
  static propTypes = {
    attachments: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]),
    text: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
    timestamp: PropTypes.string,
    firstInChain: PropTypes.bool,
    user: PropTypes.shape({ image: PropTypes.string, name: PropTypes.string, handle: PropTypes.string }),
    checkScroll: PropTypes.func.isRequired,
    isSending: PropTypes.bool
  }

  _handleClick() {
    console.log(this.props)
  }

  render() {
    const { timestamp, user, text, attachments, firstInChain, checkScroll, isSending } = this.props
    return (
      <div onClick={::this._handleClick} className={classnames('message', {firstInChain}, {isSending})}>
        <div className='aside'>
          {firstInChain ? (
            <div style={{backgroundImage: `url(${user.image})`}} className='profile_pic' />
            ) : (
            <span className='time'>{timestamp}</span>
          )}
        </div>
        <div className='body'>
          {firstInChain ? (
            <div className='info'>
              <span className='user'>{user.handle}</span>
              <span className='time'>{timestamp}</span>
            </div>
          ) : null}
          {text ? (<div className='text'>{text}</div>) : null}
          {attachments && attachments.length > 0 ? (
            <Attachments checkScroll={checkScroll} attachments={attachments} />
          ) : null}
        </div>
      </div>
    )
  }
}
