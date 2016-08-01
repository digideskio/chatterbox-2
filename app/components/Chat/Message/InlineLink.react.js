import React, { Component, PropTypes } from 'react'
// import path from 'path'
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
    this.setState({ popOverOpen: true })
    const { url, linkPreviews: { loaded, loading }, loadPreview } = this.props
    if (!loaded[url] && !loading.includes(url)) {
      console.log('REQUESTING URL', url)
      loadPreview(url)
    }
  }

  handleHoverOut = () => this.setState({ popOverOpen: false })

  render() {
    const { url, label, linkPreviews: { loaded } } = this.props
    return (
      <div
        onClick={::this.handleClick}
        onMouseEnter={::this.handleHover}
        onMouseLeave={this.handleHoverOut}
        className={styles.link}
      >
        {
          this.state.popOverOpen && loaded[url] ? (
            <div className={styles.linkImage} style={{backgroundImage: `url(data:image/png;base64,${loaded[url]})`}} />
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
