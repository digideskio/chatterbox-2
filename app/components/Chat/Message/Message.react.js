import React, { Component, PropTypes } from 'react'
import moment from 'moment'
import classnames from 'classnames'
import Attachments from './Attachments.react'

export default class Message extends Component {
  static propTypes = {
    attachments: PropTypes.oneOfType([PropTypes.array, PropTypes.bool]),
    text: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
    timestamp: PropTypes.string,
    firstInChain: PropTypes.bool,
    user: PropTypes.shape({ image: PropTypes.string, name: PropTypes.string, handle: PropTypes.string })
  }

  _handleClick() {
    console.log(this.props)
  }

  render() {
    const { timestamp, user, text, attachments, firstInChain } = this.props
    return (
      <div onClick={::this._handleClick} className={classnames('message', {firstInChain})}>
        <div className='aside'>
          {
            firstInChain ? (
              <div style={{backgroundImage: `url(${user.image})`}} className='profile_pic' />
            ) : (
              <span className='time'>{timestamp}</span>
            )
          }
        </div>
        <div className='body'>
          {
            firstInChain ? (
              <div className='info'>
                <span className='user'>{user.handle}</span>
                <span className='time'>{timestamp}</span>
              </div>
            ) : null
          }
          {text ? (<div className='text'>{text}</div>) : null}
          {
            attachments && attachments.length > 0 ? (
              <Attachments attachments={attachments} />
            ) : null
          }
        </div>
      </div>
    )
  }
}

export class DaySeparator extends Component {
  static propTypes = {
    timestamp: PropTypes.number.isRequired
  }

  get parsedTime() {
    return moment().calendar(this.props.timestamp, {
      sameDay: '[Today]',
      nextDay: '[Tomorrow]',
      nextWeek: 'dddd',
      lastDay: '[Yesterday]',
      lastWeek: '[Last] dddd',
      sameElse: '[Today]'
    })
  }

  render() {
    return (
      <div className='daySeparator'>
        <div />
        <span>{this.parsedTime}</span>
        <div />
      </div>
    )
  }
}
