import React, { PureComponent, PropTypes } from 'react'
import { changeActiveTeamChannelOrDM } from 'actions/teams'
import { connect } from 'react-redux'
import classnames from 'classnames'

function mapStateToProps({ teams: { teams, activeTeamID } }, { id }) {
  const { channels, activeChannelorDMID, id: teamID } = teams[activeTeamID]
  return { active: activeChannelorDMID === id, teamID, ...channels[id] }
}

@connect(mapStateToProps, { changeActiveTeamChannelOrDM })
export default class Channel extends PureComponent {
  static propTypes = {
    id: PropTypes.string,
    active: PropTypes.bool,
    name: PropTypes.string,
    missedPings: PropTypes.oneOfType([PropTypes.number, PropTypes.bool]),
    changeActiveTeamChannelOrDM: PropTypes.func.isRequired,
    isPrivate: PropTypes.bool.isRequired,
    teamID: PropTypes.string
  }

  handleOnClick() {
    const { changeActiveTeamChannelOrDM, id, teamID } = this.props
    changeActiveTeamChannelOrDM(id, teamID)
  }

  render() {
    const { missedPings, active, name, isPrivate } = this.props
    return (
      <div onClick={::this.handleOnClick} className={classnames('channel', {active}, {attention: missedPings})}>
        {isPrivate ? <i className='ion-locked privateIcon' /> : null}
        <p>{name}</p>
        {
          missedPings ? <span className='missed_pings'>{missedPings}</span> : null
        }
      </div>
    )
  }
}
