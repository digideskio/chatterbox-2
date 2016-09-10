import React, { PureComponent, PropTypes } from 'react'
import { connect } from 'react-redux'
import { changeActiveTeam } from 'actions/teams'

function mapStateToProps({ teams: { teams, activeTeamID } }, { id }) {
  const { name, type, image, unreds, pings } = teams[id]
  return { activeTeamID, name, type, image, unreds, pings }
}

@connect(mapStateToProps, { changeActiveTeam })
export default class Team extends PureComponent {
  static propTypes = {
    id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    name: PropTypes.string,
    image: PropTypes.string,
    unreads: PropTypes.bool,
    pings: PropTypes.number,
    changeActiveTeam: PropTypes.func.isRequired,
    activeTeamID: PropTypes.string
  }

  componentDidUpdate() {
    console.log('Team did update')
  }

  handleTeamClick() {
    const { id, changeActiveTeam, activeTeamID } = this.props
    if (activeTeamID !== id) {
      changeActiveTeam(id)
    }
  }

  render() {
    const { unreads, pings, type, name, image } = this.props
    return (
      <div onClick={::this.handleTeamClick} className='team' style={{backgroundImage: `url(${image})`}} title={name}>
        {unreads ? <div className='new_message' /> : null}
        {pings ? <div className='unread_counter'>{pings}</div> : null}
        <img src={`images/logins/${type}/icon.svg`} className='providerIcon' />
      </div>
    )
  }
}
