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

  state = {
    popOverOpen: false
  }

  handleClick() {
    shell.openExternal(this.props.url)
  }

  handleHover() {
    const { url, linkPreviews: { loaded, loading }, loadPreview } = this.props
    if (loaded[url]) return this.setState({ popOverOpen: true })
    loadPreview(url)
  }

  render() {
    const { url, label, linkPreviews: { loaded, loading } } = this.props
    console.log(loaded, loading, url)
    return (
      <div onClick={::this.handleClick} onMouseOver={::this.handleHover} className={styles.link}>
        {
          this.state.popOverOpen ? (
            <img src={linkPreviews[url]} />
          ) : null
        }
        {label || url}
      </div>
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
