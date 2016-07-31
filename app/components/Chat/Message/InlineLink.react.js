import React, { Component, PropTypes } from 'react'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { shell } from 'electron'
import * as LinkPreviewsActions from 'actions/linkPreviews'
import styles from 'styles/chat.css'


class InlineLink extends Component {
  static propTypes = {
    url: PropTypes.string,
    label: PropTypes.string,
    loadPreview: PropTypes.func.isRequired,
    settings: PropTypes.object.isRequired,
    linkPreviews: PropTypes.object.isRequired
  }

  handleClick() {
    shell.openExternal(this.props.url)
  }

  handleHover() {
    const { url, linkPreviews, loadPreview } = this.props
    console.log(linkPreviews)
    loadPreview(url)
  }

  render() {
    const { url, label } = this.props
    return (
      <div onClick={::this.handleClick} onMouseOver={::this.handleHover} className={styles.link}>{label || url}</div>
    )
  }
}


function mapStateToProps({ settings, linkPreviews }) {
  return { settings, linkPreviews }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(LinkPreviewsActions, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(InlineLink)
