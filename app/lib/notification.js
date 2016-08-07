import { notify } from 'node-notifier'
import { remote } from 'electron'
import { EventEmitter } from 'events'
import { join } from 'path'

const defualtIcon = join(__dirname, '../images/temp_logo.png')

export default class Notification extends EventEmitter {
  constructor({ title, message, icon = defualtIcon }, settings, evenIfFocused = false) {
    super()
      // if (remote.getCurrentWindow().isFocused() && !evenIfFocused) return

    this.notifier = notify({ title, message, icon: void 0, sound: true, wait: true }, ::this._handleClick)
    this.notifier.once('click', ::this._handleClick)
    this.notifier.once('timeout', ::this._handleTimeout)
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
    this.notifier.removeAllListeners()
    this.removeAllListeners()
  }
}
