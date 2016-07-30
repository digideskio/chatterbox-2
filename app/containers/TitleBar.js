import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import TitleBar from 'components/TitleBar.react'
import * as TitleBarActions from 'actions/titlebar'


function mapStateToProps({ titlebar }) {
  return { titlebar }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(TitleBarActions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(TitleBar)
