import React, { Component, PropTypes } from 'react'
import styles from 'styles/login.css'

export default class Login extends Component {

  state = {
    dots: ''
  }

  componentDidMount() {

  }

  componentWillUnmount() {

  }


  render() {
    return (
      <div className={styles.login}>
        <div className={styles.sidebar}>
        </div>
        <div className={styles.webview}>
          <webview src='https://slack.com/oauth/pick_reflow?client_id=8772351907.62016425399&scope=channels%3Aread&redirect_uri=http%3A%2F%2Flocalhost'/>
        </div>
      </div>
    )
  }
}
