import React from 'react'
import TeamInfo from './teamInfo'
import Teams from './teams'

export default function() {
  return (
    <div className='app-sidebar'>
      <Teams />
      <TeamInfo />
    </div>
  )
}
