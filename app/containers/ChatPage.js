import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Team from 'components/Team.react'
import * as SettingsActions from 'actions/settings'
import * as TeamsActions from 'actions/teams'

function mapStateToProps({ settings, teams, messages }) {
  return { settings, ...teams, messages }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({...TeamsActions, ...SettingsActions }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Team)
