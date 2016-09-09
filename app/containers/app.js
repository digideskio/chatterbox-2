import React, { Component, PropTypes } from 'react'
import Sidebar from './sidebar'

export default class App extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
    location: PropTypes.shape({ pathname: PropTypes.string.isRequired })
  }

  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  componentWillMount() {
    if (this.props.location.pathname !== '/') {
      this.context.router.replace('/')
    }
  }

  render() {
    return (
      <div className='app'>
        <Sidebar />
        {this.props.children}
      </div>
    )
  }
}
