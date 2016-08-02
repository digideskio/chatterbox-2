import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import classnames from 'classnames'
import * as TeamsActions from 'actions/teams'

class InlineUser extends Component {
  static propTypes = {
    isPing: PropTypes.bool,
    name: PropTypes.string,
    handle: PropTypes.string,
    id: PropTypes.string
  }

  static defaultProps = {
    isPing: false
  }

  render() {
    const { isPing } = this.props
    return (
      <span className={classnames('user', {isPing})}>
        @{this.props.handle}
      </span>
    )
  }
}


function mapStateToProps({ settings }) {
  return { settings }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(TeamsActions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(InlineUser)