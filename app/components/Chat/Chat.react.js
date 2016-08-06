import React, { PureComponent, PropTypes } from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import _ from 'lodash'
import Message from './Message/Message.react'
import DaySeparator from './Message/DaySeparator.react'
import Sender from './Sender.react'

export default class Chat extends PureComponent {
  static propTypes = {
    messages: PropTypes.array,
    users: PropTypes.object,
    channel: PropTypes.object,
    team: PropTypes.object,
    requestHistory: PropTypes.func.isRequired
  }

  componentDidMount() {
    this._scrollBottom()
  }

  componentDidUpdate({ messages: prevMessages }) {
    console.info('CHAT UPDATED')
    this._checkScroll()
  }

  handleScroll({ target }) {
    if (target.scrollTop <= 20) {
      const { channel: { id: channelID }, team: { id: teamID }, requestHistory, messages } = this.props
      const { timestamp: lastMessageTimestamp } = _.first(messages)
      requestHistory(lastMessageTimestamp, null, channelID, teamID)
    }
  }

  _checkScroll() {
    const { messagesContainer } = this.refs
    if (messagesContainer && messagesContainer.scrollTop + messagesContainer.offsetHeight >= messagesContainer.scrollHeight - 15) {
      this._scrollBottom()
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

  get channelMeta() {
    const { members, meta = {} } = _.get(this.props, 'channel', {})
    let channelMeta = []
    if (members) {
      channelMeta.push(
        <span className='meta' key='members'>
          {_.isArray(members) ? members.length : members} Members
        </span>
      )
    }

    _.forEach(meta, value => channelMeta.push(
      <div key={value}>
        <span className='spacer'>|</span>
        <span className='meta'>{value}</span>
      </div>
    ))

    return channelMeta
  }

  render() {
    return (
      <div className='chat'>
        <header>
          <div className='info'>
            <span className='channel'>{this.props.channel.name}</span>
            {this.channelMeta}
          </div>
        </header>
        <ReactCSSTransitionGroup
          component='div'
          className='messages'
          key={this.props.channel.id}
          onScroll={::this.handleScroll}
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
                  <div>
                    <DaySeparator key={timestamp} timestamp={Number(timestamp)} />
                    {messageEl}
                  </div>
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
