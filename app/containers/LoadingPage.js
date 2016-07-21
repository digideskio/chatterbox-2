import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Loading from 'components/Loading.react'
import * as SettingsActions from 'actions/settings'

function mapStateToProps({ settings, teams }) {
  return { settings, teams }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(SettingsActions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Loading)
