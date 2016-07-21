import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import styles from 'styles/loading.css'

export default class Loading extends Component {
  static propTypes = {
    settings: PropTypes.object.isRequired,
    loadSettings: PropTypes.func.isRequired,
    updateSettingsloaded: PropTypes.func.isRequired
  }

  state = {
    dots: '',
    percent: 0,
    task: ''
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

  _loadSettings() {
    console.log(this.props.settings)
    this.props.loadSettings()
  }

  render() {
    return (
      <div className={styles.loading}>
        <img className={styles.gif} src='images/buildbox.gif' />
        <div className={styles.info}>
          <div className={styles.title}>Loading database<span>{this.state.dots}</span></div>
          <div className={styles.progress_bar}>
            <div style={{width: `${this.state.percent}%`}}/>
          </div>
        </div>
      </div>
    )
  }
}
