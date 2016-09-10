import React, { PureComponent, PropTypes } from 'react'
import { connect } from 'react-redux'
import { sendMessage } from 'actions/messages'

function mapStateToProps({ settings, teams: { teams, activeTeamID }, messages: allMessages }, { activeChannelorDMID }) {
  const { team: { id: teamID } } = teams[activeTeamID]
  return { activeChannelorDMID, teamID }
}

@connect(mapStateToProps, { sendMessage })
export default class Sender extends PureComponent {
  static propTypes = {
    sendMessage: PropTypes.func.isRequired,
    activeChannelorDMID: PropTypes.string,
    teamID: PropTypes.string
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
