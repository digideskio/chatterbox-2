import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'
import { platform } from 'os'
import TitleBar from './TitleBar'

export default class App extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired
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
