import notifier from 'node-notifier'
import { remote } from 'electron'
import { EventEmitter } from 'events'
import { resolve } from 'path'

const defualtIcon = resolve(__dirname, '../images/temp_logo.png')

export default class Notification extends EventEmitter {
  constructor({ title, message, icon = defualtIcon }, settings, evenIfFocused = false) {
    super()
      // if (remote.getCurrentWindow().isFocused() && !evenIfFocused) return

    this._notifier = notifier.notify({ title, message, icon, sound: true, wait: true }, (err, la) => {
      console.log(err, la)
    })
    this._notifier.once('click', ::this._handleClick)
    this._notifier.once('timeout', ::this._handleTimeout)
  }

  _handleClick() {
    this.emit('clicked')
    this._cleanUp()
  }

  _handleTimeout() {
    this.emit('timeout')
    this._cleanUp()
  }

  _cleanUp() {
    this._notifier.removeAllListeners()
    this.removeAllListeners()
  }
}
