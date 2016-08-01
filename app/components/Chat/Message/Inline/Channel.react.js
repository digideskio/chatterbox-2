import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import * as TeamsActions from 'actions/teams'


class InlineChannel extends Component {
  static propTypes = {
    name: PropTypes.string,
    id: PropTypes.string
  }

  render() {
    return (
      <div className='channel'>
        {this.props.name}
      </div>
    )
  }
}


function mapStateToProps({ settings }) {
  return { settings }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(TeamsActions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(InlineChannel)
