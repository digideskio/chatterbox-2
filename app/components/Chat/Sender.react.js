import React, { Component, PropTypes } from 'react'

export default class Sender extends Component {

  static propTypes = {
    sendMessage: PropTypes.func,
    isTyping: PropTypes.string,
    channelID: PropTypes.string,
    teamID: PropTypes.string
  }

  handleKeyPress(event) {
    if (event.keyCode == 13 && !event.shiftKey) {
      event.preventDefault()
      let { value: chatText } = this.refs['chat-input']
      if (chatText.replace(/(\r\n|\n|\r)/gm, '').length === 0) return
      const { sendMessage, channelID, teamID } = this.props
      sendMessage(teamID, channelID, chatText)
      this.refs['chat-input'].value = ''
    }
  }

  render() {
    return (
      <div className='sender'>
        <textarea onKeyDown={::this.handleKeyPress} ref='chat-input' placeholder='Type something...' className='text-input' />
      </div>
    )
  }
}
