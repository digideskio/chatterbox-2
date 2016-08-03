import React, { Component, PropTypes } from 'react'
import Sidebar from './Sidebar'

export default class App extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  static propTypes = {
    children: PropTypes.element.isRequired,
    location: PropTypes.shape({ pathname: PropTypes.string.isRequired })
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
