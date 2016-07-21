import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import TitleBar from 'components/TitleBar.react'
import * as TitleBarActions from 'actions/titlebar'


export default connect(
  ({ titlebar }) => titlebar,
  dispatch => bindActionCreators(TitleBarActions, dispatch)
)(TitleBar)
