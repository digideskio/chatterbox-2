import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { loadSettings } from 'actions/settings'

@connect(({ loading }) => loading, { loadSettings })
export default class Loading extends Component {
  static propTypes = {
    task: PropTypes.string.isRequired,
    percent: PropTypes.number.isRequired,
    loadSettings: PropTypes.func.isRequired
  }

  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  state = {
    dots: ''
  }

  componentDidMount() {
    this.mounted = true
    this.dotDotDotInterval = setInterval(() => {
      if (this.mounted) {
        this.setState({ dots: this.state.dots.length > 2 ? '' : `${this.state.dots}.` })
      }
    }, 1000)
    this.props.loadSettings()
  }

  componentWillUnmount() {
    this.mounted = false
    clearInterval(this.dotDotDotInterval)
  }

  render() {
    const { state: { dots }, props: { task, percent } } = this
    return (
      <div className='loading'>
        <img className='gif' src='images/buildbox.gif' />
        <div className='info'>
          <div className='title'>
            {task}
            <span>{dots}</span>
          </div>
          <div className='progress_bar'>
            <div style={{width: `${percent}%`}} />
          </div>
        </div>
      </div>
    )
  }
}
