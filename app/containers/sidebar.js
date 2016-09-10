import React from 'react'
import TeamInfo from 'components/sidebar/teamInfo'
import Teams from 'components/sidebar/teams'

export default function() {
  return (
    <div className='app-sidebar'>
      <Teams />
      <TeamInfo />
    </div>
  )
}
