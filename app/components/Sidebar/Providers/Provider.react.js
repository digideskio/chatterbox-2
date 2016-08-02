import React, { Component, PropTypes } from 'react'

export default class Provider extends Component {
  static propTypes = {
    image: PropTypes.string,
    unreads: PropTypes.bool,
    pings: PropTypes.number,
    id: PropTypes.string,
    onClick: PropTypes.func.isRequired
  }

  static defaultProps = {
    currentTeam: {}
  }

  handleClick = () => this.props.onClick(this.props.id)

  render() {
    return (
      <div onClick={this.handleClick} className='team' style={{backgroundImage: `url(${this.props.image})`}}>
        {
          this.props.unreads ? <div className='new_message' /> : null
        }
        {
          this.props.pings ? <div className='unread_counter'>{this.props.pings}</div> : null
        }
      </div>
    )
  }
}
