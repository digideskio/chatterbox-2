import React, { PureComponent, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as MessageActions from 'actions/messages'
import { last, get } from 'lodash'

function mapStateToProps({ settings, teams: { teams, activeTeamID }, messages: allMessages }) {
  const { activeChannelorDMID, users, team: { id: teamID } = {} } = (teams[activeTeamID] || {})
  const lastMessage = last(get(allMessages, `${activeTeamID}.${activeChannelorDMID}`, []))
  return { users, activeChannelorDMID, teamID, lastMessage }
}

@connect(mapStateToProps, MessageActions)
export default class Sender extends PureComponent {
  static propTypes = {
    sendMessage: PropTypes.func,
    isTyping: PropTypes.string,
    activeChannelorDMID: PropTypes.string,
    teamID: PropTypes.string,
    users: PropTypes.object,
    lastMessage: PropTypes.object
  }

  handleKeyPress(event) {
    if (event.keyCode == 13 && !event.shiftKey) {
      event.preventDefault()
      let { value: chatText } = this.refs['chat-input']
      if (chatText.replace(/(\r\n|\n|\r)/gm, '').length === 0) return
      const { sendMessage, activeChannelorDMID, teamID } = this.props
      sendMessage(teamID, activeChannelorDMID, chatText)
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
