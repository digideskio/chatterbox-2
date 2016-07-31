import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import classnames from 'classnames'
import * as TeamsActions from 'actions/teams'
import styles from 'styles/chat.css'


class InlineChannel extends Component {
  static propTypes = {
    name: PropTypes.string,
    id: PropTypes.string
  }

  render() {
    return (
      <div className={classnames(styles.channel)}>{this.props.name}</div>
    )
  }
}


function mapStateToProps({ settings, loading, teams }) {
  return { settings }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(TeamsActions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(InlineChannel)