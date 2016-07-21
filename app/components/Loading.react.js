import React, { Component, PropTypes } from 'react'
import { Link } from 'react-router'
import styles from 'styles/loading.css'

export default class Loading extends Component {
  static propTypes = {
    percent: PropTypes.number,
    task: PropTypes.string
  }

  state = {
    dots: ''
  }

  componentDidMount() {
    this.mounted = true
    this.dotDotDotInterval = setInterval(() => this.mounted && this.setState({ dots: this.state.dots.length > 2 ? '' : `${this.state.dots}.` }), 1000)
  }


  render() {
    return (
      <div className={styles.loading}>
        <img className={styles.gif} src='images/buildbox.gif' />
        <div className={styles.info}>
          <div className={styles.title}>Loading database<span>{this.state.dots}</span></div>
          <div className={styles.progress_bar}>
            <div/>
          </div>
        </div>
      </div>
    )
  }
}
