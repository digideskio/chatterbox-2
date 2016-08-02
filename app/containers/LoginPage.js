import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import Login from 'components/Login'
import * as LoginActions from 'actions/login'

function mapStateToProps({ login, teams: { teams } }) {
  return { login, isCloseable: (Object.keys(teams).length > 0) }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(LoginActions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)
