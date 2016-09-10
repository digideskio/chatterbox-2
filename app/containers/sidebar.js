import React, { Component } from 'react'
import TeamInfo from 'components/sidebar/teamInfo'
import Teams from 'components/sidebar/teams'

export default class Sidebar extends Component {
  render() {
    return (
      <div className='app-sidebar'>
        <Teams />
        <TeamInfo />
      </div>
    )
  }
}
