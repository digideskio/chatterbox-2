import React, { Component, PropTypes } from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import _ from 'lodash'
import Message from './Message/Message.react'
import DaySeparator from './Message/DaySeparator.react'
import Sender from './Sender.react'

export default class Chat extends Component {
  static propTypes = {
    messages: PropTypes.array,
    users: PropTypes.object,
    channel: PropTypes.object,
    team: PropTypes.object
  }

  componentDidMount() {
    this._scrollBottom()
  }

  componentDidUpdate({ messages: prevMessages }) {
    console.info('CHAT UPDATED')
    this._checkScroll()
  }

  _checkScroll() {
    const { messagesContainer } = this.refs
    if (messagesContainer) {
      const shouldScrollBottom = messagesContainer.scrollTop + messagesContainer.offsetHeight >= messagesContainer.scrollHeight - 15
      if (shouldScrollBottom) {
        this._scrollBottom()
      }
    }
  }

  _scrollBottom() {
    const lastMessage = _.last(this.refs.messagesContainer.children)
    if (lastMessage) {
      _.defer(::lastMessage.scrollIntoView)
    }
  }

  _mapUserIDtoData(id, messageIdx) {
    if (this.props.messages[messageIdx].userProfile) {
      const { handle, name, image } = this.props.messages[messageIdx].userProfile
      return { handle, name, image }
    } else {
      const { name, handle, images } = _.get(this.props.users, id, {})
      return { name, handle, image: _.last(images) }
    }
  }

  render() {
    return (
      <div className='chat'>
        <header>
          <div className='info'>
            <span className='channel'>{this.props.channel.name}</span>
            <span className='meta'>{_.get(this.props, 'channel.meta.members') || `${_.get(this.props, 'channelUsers.length')} Members`}</span>
            {
              _.get(this.props, 'channel.meta.topic') ? (
                <div>
                  <span className='spacer'>|</span>
                  <span className='meta'>{this.props.channel.meta.topic}</span>
                </div>
              ) : null
            }
          </div>
        </header>
        <ReactCSSTransitionGroup
          component='div'
          className='messages'
          key={this.props.channel.id}
          transitionName='fade'
          transitionAppear
          transitionEnterTimeout={50}
          transitionAppearTimeout={50}
          transitionLeaveTimeout={50}
        >
          <section ref='messagesContainer' className='animation-wrapper'>
            {
              this.props.messages.map(({key, text, user, timestamp, friendlyTimestamp, ...message}, idx) => {
                const {user: prevUser, timestamp: prevTimestamp} = this.props.messages[idx - 1] || {}
                const messageEl = (
                  <Message
                    key={key}
                    checkScroll={::this._checkScroll}
                    firstInChain={prevUser !== user}
                    user={::this._mapUserIDtoData(user, idx)}
                    text={text}
                    timestamp={friendlyTimestamp || timestamp}
                    {...message}
                  />
                )
                return (!prevTimestamp || new Date(Number(prevTimestamp)).getDay() !== new Date(Number(timestamp)).getDay()) ? (
                  [<DaySeparator key={timestamp} timestamp={Number(timestamp)} />, messageEl]
                ) : messageEl
              })
            }
          </section>
        </ReactCSSTransitionGroup>
        <Sender />
      </div>
    )
  }
}
