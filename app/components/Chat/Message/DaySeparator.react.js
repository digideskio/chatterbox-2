import React, { PureComponent, PropTypes } from 'react'
import moment from 'moment'

export default class DaySeparator extends PureComponent {
  static propTypes = {
    timestamp: PropTypes.number.isRequired
  }

  get parsedTime() {
    return moment().calendar(this.props.timestamp, {
      sameDay: '[Today]',
      nextDay: '[Tomorrow]',
      nextWeek: 'dddd',
      lastDay: '[Yesterday]',
      lastWeek: '[Last] dddd',
      sameElse: '[Today]'
    })
  }

  render() {
    return (
      <div className='daySeparator'>
        <div />
        <span>{this.parsedTime}</span>
        <div />
      </div>
    )
  }
}
