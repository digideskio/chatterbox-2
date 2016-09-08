import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

import Teams from 'components/Sidebar/Teams'
import * as SettingsActions from 'actions/settings'
import * as TeamsActions from 'actions/teams'
import { showLogin } from 'actions/login'

const mapStateToProps = ({ settings, teams: { teams, activeTeamID }, loading: { finished } }) => ({
  show: finished,
  team: teams[activeTeamID] || {},
  settings,
  teams
})

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    ...TeamsActions,
    ...SettingsActions,
    showLogin
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Teams)
