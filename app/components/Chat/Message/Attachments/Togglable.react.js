import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'


export default class Togglable extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
    title: PropTypes.any
  }

  state = {
    isOpen: true
  }

  handleToggle() {
    this.setState({ isOpen: !this.state.isOpen })
  }

  render() {
    const { title } = this.props
    const { isOpen } = this.state
    return (
      <span className='togglable'>
        {title ? <span>{title}</span> : null}
        <span onClick={::this.handleToggle} className={classnames(isOpen ? 'ion-arrow-down-b' : 'ion-arrow-right-b', 'toggler')} />
        {
          isOpen ? this.props.children : null
        }
      </span>
    )
  }
}
