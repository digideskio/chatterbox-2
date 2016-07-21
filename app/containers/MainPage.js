import React, { Component } from 'react'
import Sidebar from 'components/Sidebar'
import Chat from 'components/Chat'
import styles from 'styles/layout.css'

export default class MainPage extends Component {
  render() {
    return (
      <div className={styles['mainPage']}>
        <Sidebar />
        <Chat />
      </div>
    )
  }
}
