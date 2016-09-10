import React, { PureComponent, PropTypes } from 'react'
import { connect } from 'react-redux'
import { showLogin } from 'actions/login'
import Team from './team.react'

function mapStateToProps({ teams: { teams = {}, activeTeamID } }) {
  const { team: { image } = {} } = (teams[activeTeamID] || {})
  return { teams: Object.keys(teams), image }
}

@connect(mapStateToProps, { showLogin })
export default class Teams extends PureComponent {
  static propTypes = {
    showLogin: PropTypes.func.isRequired,
    teams: PropTypes.array,
    image: PropTypes.string
  }

  static defaultProps = {
    teams: []
  }

  componentDidUpdate() {
    console.log('Teams did update')
  }

  render() {
    const { image, teams, showLogin } = this.props
    return (
      <div className='teams'>
        {image ? <div className='selected team' style={{backgroundImage: `url(${image})`}} /> : null}
        {teams.map(id => <Team key={id} id={id} />)}
        <div className='ion-ios-plus-empty add' onClick={showLogin} title='Add new team' />
      </div>
    )
  }
}
