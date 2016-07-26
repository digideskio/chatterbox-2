import React, { Component, PropTypes } from 'react'
import Chat from './Chat'
import Sidebar from './Sidebar'

export default class Team extends Component {
  static propTypes = {
    routeParams: PropTypes.object.isRequired
  }

  componentDidMount() {
    console.log(this.props)
    this.mounted = true
  }

  componentWillUnmount() {
    this.mounted = false
  }

  render() {
    return (
      <div>
        <Sidebar />
        <Chat />
      </div>
    )
  }
}
