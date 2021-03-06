import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'

export default class Channel extends Component {
  static propTypes = {
    id: PropTypes.string,
    active: PropTypes.bool,
    name: PropTypes.string,
    missedPings: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
    onClick: PropTypes.func.isRequired,
    isPrivate: PropTypes.bool.isRequired
  }

  handleOnClick = () => this.props.onClick(this.props.id)

  render() {
    const { missedPings, active, name, isPrivate } = this.props
    return (
      <div onClick={this.handleOnClick} className={classnames('channel', {active}, {attention: missedPings})}>
        {isPrivate ? <i className='ion-locked privateIcon' /> : null}
        <p>{name}</p>
        {
          missedPings ? <span className='missed_pings'>{missedPings}</span> : null
        }
      </div>
    )
  }
}
