import React, { PureComponent, PropTypes } from 'react'

export default class Team extends PureComponent {
  static propTypes = {
    id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    image: PropTypes.string,
    unreads: PropTypes.bool,
    pings: PropTypes.number,
    onClick: PropTypes.func.isRequired
  }

  handleClick() {
    this.props.onClick(this.props.id)
  }

  render() {
    const { unreads, pings, type, image } = this.props
    return (
      <div onClick={::this.handleClick} className='team' style={{backgroundImage: `url(${image})`}}>
        {
          unreads ? <div className='new_message' /> : null
        }
        {
          pings ? <div className='unread_counter'>{pings}</div> : null
        }
        <img src={`images/logins/${type}/icon.svg`} className='providerIcon' />
      </div>
    )
  }
}
