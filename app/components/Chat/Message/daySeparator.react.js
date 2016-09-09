import React from 'react'
import moment from 'moment'

function parsedTimetamp(timestamp) {
  return moment().calendar(timestamp, {
    sameDay: '[Today]',
    nextDay: '[Tomorrow]',
    nextWeek: 'dddd',
    lastDay: '[Yesterday]',
    lastWeek: '[Last] dddd',
    sameElse: '[Today]'
  })
}

export default function DaySeparator({ timestamp }) {
  return (
    <div className='daySeparator'>
      <div />
      <span>{parsedTimetamp(timestamp)}</span>
      <div />
    </div>
  )
}
