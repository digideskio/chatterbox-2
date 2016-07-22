import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Loading from 'components/Loading.react'
import * as SettingsActions from 'actions/settings'
import * as LoadingActions from 'actions/loading'

function mapStateToProps({ settings, loading, teams }) {
  return { settings, teams, ...loading }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(SettingsActions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Loading)
