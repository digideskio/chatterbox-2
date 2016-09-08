import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Loading from 'components/loading.react'
import * as LoadingActions from 'actions/loading'

function mapStateToProps({ settings, loading, teams }) {
  return { settings, teams, ...loading }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(LoadingActions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Loading)
