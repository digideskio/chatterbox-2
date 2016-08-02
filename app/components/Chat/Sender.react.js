import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as MessageActions from 'actions/messages'
import _ from 'lodash'

class Sender extends Component {
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


function mapStateToProps({ settings, teams: { teams, activeTeamID }, messages: allMessages }) {
  const { activeChannelorDMID, users, team: { id: teamID } = {} } = (teams[activeTeamID] || {})
  const lastMessage = _.last(_.get(allMessages, `${activeTeamID}.${activeChannelorDMID}`, []))
  return { users, activeChannelorDMID, teamID, lastMessage }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(MessageActions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Sender)
