import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Login from 'components/login'
import * as LoginActions from 'actions/login'


function mapStateToProps({ login }) {
  return { login }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(LoginActions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)
