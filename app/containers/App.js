import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'
import { platform } from 'os'
import TitleBar from './TitleBar'

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
      <div className={classnames('app-frame', platform())}>
        <TitleBar />
        {this.props.children}
      </div>
    )
  }
}
