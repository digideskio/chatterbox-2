import React, { Component, PropTypes } from 'react'
import { defer } from 'lodash'
import styles from 'styles/loading.css'

export default class Loading extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  static propTypes = {
    settings: PropTypes.object.isRequired,
    loadSettings: PropTypes.func.isRequired,
    loaded: PropTypes.number.isRequired,
    task: PropTypes.string.isRequired,
    done: PropTypes.array.isRequired
  }

  state = {
    dots: '',
    hasStartedLoading: []
  }

  componentDidMount() {
    this.mounted = true
    this.dotDotDotInterval = setInterval(() => this.mounted && this.setState({ dots: this.state.dots.length > 2 ? '' : `${this.state.dots}.` }), 1000)
    this._loadSettings()
  }

  componentWillUnmount() {
    this.mounted = false
    clearInterval(this.dotDotDotInterval)
  }

  componentDidUpdate() {
    const { hasStartedLoading } = this.state
    const { done } = this.props

    if (!hasStartedLoading.includes('teams') && done.includes('settings') && !done.includes('teams')) {
      this.setState({ hasStartedLoading: [...this.state.hasStartedLoading, 'teams'] })
      console.log('START THE TEAM LOAD')
      this.context.router.push('/login/slack')
    }
  }

  _loadSettings() {
    this.props.loadSettings()
    this.setState({ hasStartedLoading: [...this.state.hasStartedLoading, 'settings'] })
  }

  render() {
    return (
      <div className={styles.loading}>
        <img className={styles.gif} src='images/buildbox.gif' />
        <div className={styles.info}>
          <div className={styles.title}>{this.props.task}<span>{this.state.dots}</span></div>
          <div className={styles.progress_bar}>
            <div style={{width: `${this.props.loaded}%`}}/>
          </div>
        </div>
      </div>
    )
  }
}
