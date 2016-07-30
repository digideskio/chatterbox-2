import React, { Component, PropTypes } from 'react'
import styles from 'styles/loading.css'

export default class Loading extends Component {
  static contextTypes = {
    router: PropTypes.object.isRequired
  }

  static propTypes = {
    settings: PropTypes.object.isRequired,
    load: PropTypes.func.isRequired,
    task: PropTypes.string.isRequired,
    loaded: PropTypes.number.isRequired
  }

  state = {
    dots: '',
    hasStartedLoading: []
  }

  componentDidMount() {
    this.mounted = true
    this.dotDotDotInterval = setInterval(() => this.mounted && this.setState({ dots: this.state.dots.length > 2 ? '' : `${this.state.dots}.` }), 1000)
    this.props.load()
  }

  componentWillUnmount() {
    this.mounted = false
    clearInterval(this.dotDotDotInterval)
  }

  render() {
    return (
      <div className={styles.loading}>
        <img className={styles.gif} src='images/buildbox.gif' />
        <div className={styles.info}>
          <div className={styles.title}>{this.props.task}<span>{this.state.dots}</span></div>
          <div className={styles.progress_bar}>
            <div style={{width: `${this.props.loaded}%`}} />
          </div>
        </div>
      </div>
    )
  }
}
