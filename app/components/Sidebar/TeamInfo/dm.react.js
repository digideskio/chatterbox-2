import React, { Component, PropTypes } from 'react'
import { changeActiveTeamChannelOrDM } from 'actions/teams'
import { connect } from 'react-redux'
import classnames from 'classnames'

function mapStateToProps({ teams: { teams, activeTeamID } }, { id }) {
  const { dms, activeChannelorDMID, id: teamID } = teams[activeTeamID]
  return { active: activeChannelorDMID === id, teamID, ...dms[id] }
}

@connect(mapStateToProps, { changeActiveTeamChannelOrDM })
export default class DM extends Component {
  static propTypes = {
    id: PropTypes.string,
    image: PropTypes.string,
    handle: PropTypes.string,
    presence: PropTypes.string,
    active: PropTypes.bool,
    name: PropTypes.string,
    missedPings: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
    changeActiveTeamChannelOrDM: PropTypes.func.isRequired
  }

  handleOnClick() {
    const { changeActiveTeamChannelOrDM, id, teamID } = this.props
    changeActiveTeamChannelOrDM(id, teamID)
  }

  render() {
    const { image, active, handle, presence } = this.props
    const classes = classnames('dm channel', { active, online: presence === 'online' })
    return (
      <div onClick={::this.handleOnClick} className={classes}>
        <div className='status' />
        <div className='image' style={{backgroundImage: `url(${image})`}} />
        <div className='name'>{handle}</div>
      </div>
    )
  }
}
