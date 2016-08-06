import React, { Component, PropTypes } from 'react'
// import path from 'path'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { shell } from 'electron'
import * as LinkPreviewsActions from 'actions/linkPreviews'


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
    if (url.includes('mailto:')) return
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
      <span
        onClick={::this.handleClick}
        onMouseEnter={::this.handleHover}
        onMouseLeave={this.handleHoverOut}
        className='link'
      >
        {
          this.state.popOverOpen && loaded[url] ? (
            <div className='popover' style={{backgroundImage: `url(data:image/png;base64,${loaded[url]})`}} />
          ) : null
        }
        {label || url}
      </span>
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
