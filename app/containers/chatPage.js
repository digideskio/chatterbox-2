import React, { PureComponent, PropTypes } from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import { Sender, Messages, Header } from 'components/chat'
import { connect } from 'react-redux'

function mapStateToProps({ teams: { teams, activeTeamID } }) {
  const { activeChannelorDMID } = (teams[activeTeamID] || {})
  return { activeChannelorDMID }
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
        <Header activeChannelorDMID={activeChannelorDMID} />
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
          <Messages activeChannelorDMID={activeChannelorDMID} />
        </ReactCSSTransitionGroup>
        <Sender activeChannelorDMID={activeChannelorDMID} />
      </div>
    )
  }
}
