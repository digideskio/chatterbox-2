import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Login from 'components/login.react'
import * as LoginActions from 'actions/login'


export default connect(
  ({ login }) => login,
  dispatch => bindActionCreators(LoginActions, dispatch)
)(Login)
