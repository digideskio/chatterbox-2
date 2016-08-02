import React, { Component, PropTypes } from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import _ from 'lodash'
import Message from './Message'
import Sender from './Sender.react'

export default class Chat extends Component {
  static propTypes = {
    messages: PropTypes.array,
    users: PropTypes.object,
    channel: PropTypes.object,
    channelUsers: PropTypes.array,
    sendMessage: PropTypes.func,
    activeChannelorDMID: PropTypes.string
  }

  static defaultProps = {
    messages: [],
    users: {},
    channelUsers: [],
    channel: {}
  }

  componentDidUpdate({ messages: prevMessages }) {
    if (prevMessages.length > 0 && this.props.messages.length > 0) {
      const [{ timestamp: prevTimestamp }, { timestamp: currentTimestamp }] = [_.last(prevMessages), _.last(this.props.messages)]
      if (prevTimestamp !== currentTimestamp) {
        this._scrollBottom()
      }
    }
  }

  _scrollBottom() {
    const { messagesContainer } = this.refs
    messagesContainer.scrollTop = messagesContainer.scrollHeight
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
    console.info(this.props)
    return (
      <div className='chat'>
        <header>
          <div className='info'>
            <span className='channel'>{this.props.channel.name}</span>
            <span className='meta'>{_.get(this.props, 'channel.meta.members') || `${this.props.channelUsers.length} Members`}</span>
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
              this.props.messages.map(({text, user, timestamp, friendlyTimestamp, ...message}, idx) => (
                <Message
                  key={`${user}-${timestamp}`}
                  firstInChain={!this.props.messages[idx - 1] || this.props.messages[idx - 1].user !== user}
                  user={::this._mapUserIDtoData(user, idx)}
                  text={text}
                  timestamp={friendlyTimestamp || timestamp}
                  {...message}
                />
              ))
            }
          </section>
        </ReactCSSTransitionGroup>
        <Sender
          sendMessage={::this.props.sendMessage}
          teamID={_.get(this.props, 'team.id')}
          channelID={this.props.activeChannelorDMID}
        />
      </div>
    )
  }
}
