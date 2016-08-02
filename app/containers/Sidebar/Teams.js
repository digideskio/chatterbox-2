import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import _ from 'lodash'

import Teams from 'components/Sidebar/Teams'
import * as SettingsActions from 'actions/settings'
import * as TeamsActions from 'actions/teams'


function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    ...TeamsActions,
    ...SettingsActions
  }, dispatch)
}

function mapStateToTeamInfoProps({ settings, teams: { teams, activeTeamID } }) {
  const { team } = teams[activeTeamID] || {}
  return { team, settings, teams }
}

export default connect(mapStateToTeamInfoProps, mapDispatchToProps)(Teams)
