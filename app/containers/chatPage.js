import React, { PureComponent, PropTypes } from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import { Sender, Messages, Header } from 'components/chat'
import { connect } from 'react-redux'

function mapStateToProps({ teams: { teams, activeTeamID } }) {
  const { activeChannelorDMID, initialActiveChannelorDMID } = (teams[activeTeamID] || {})
  return { activeChannelorDMID: activeChannelorDMID || initialActiveChannelorDMID }
}

@connect(mapStateToProps)
export default class Chat extends PureComponent {
  static propTypes = {
    activeChannelorDMID: PropTypes.string
  }

  render() {
    const { activeChannelorDMID } = this.props
    return (
      <div className='chat'>
        {activeChannelorDMID ? <Header activeChannelorDMID={activeChannelorDMID} /> : null}
        <ReactCSSTransitionGroup
          component='div'
          className='messages'
          key={activeChannelorDMID}
          transitionName='fade'
          transitionAppear
          transitionEnterTimeout={50}
          transitionAppearTimeout={50}
          transitionLeaveTimeout={50}
        >
          {activeChannelorDMID ? <Messages activeChannelorDMID={activeChannelorDMID} /> : null}
        </ReactCSSTransitionGroup>
        {activeChannelorDMID ? <Sender activeChannelorDMID={activeChannelorDMID} /> : null}
      </div>
    )
  }
}
