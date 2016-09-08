import React, { Component, PropTypes } from 'react'
import classnames from 'classnames'

export default class DM extends Component {
  static propTypes = {
    id: PropTypes.string,
    image: PropTypes.string,
    handle: PropTypes.string,
    presence: PropTypes.string,
    active: PropTypes.bool,
    name: PropTypes.string,
    missedPings: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
    onClick: PropTypes.func.isRequired
  }

  handleOnClick = () => this.props.onClick(this.props.id)

  render() {
    const { image, active, handle, presence } = this.props
    const classes = classnames('dm channel', { active, online: presence === 'online' })
    return (
      <div onClick={this.handleOnClick} className={classes}>
        <div className='status' />
        <div className='image' style={{backgroundImage: `url(${image})`}} />
        <div className='name'>{handle}</div>
      </div>
    )
  }
}
