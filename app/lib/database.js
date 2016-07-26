import localforage from 'localforage'
import async from 'async'
import { EventEmitter } from 'events'
import defaultSettings from './defaultSettings'

const TeamsInstance = localforage.createInstance({ name: 'teams', version: 1.0, driver: localforage.WEBSQL })
const SettingsInstance = localforage.createInstance({ name: 'teams', version: 1.0, driver: localforage.WEBSQL })


class Teams {
  static add(teamData) {
    console.log(teamData)
  }

  static remove() {

  }

  static getByID() {

  }

  static getAll() {
    const total = TeamsInstance.keys(successCallback)

    localforage.keys().then(keys => {
      const total = keys.length

      console.log(keys, total)
    }).catch((err) => {
      console.error(err)
    })
  }
}


class Settings {
  static change(setting, value, callback) {
    return SettingsInstance.setItem(setting, value, callback ? callback : null)
  }

  static Loader = class settingsEmitter extends EventEmitter {
    constructor() {
      super()
      const total = Object.keys(defaultSettings).length

      const settingsLoader = async.queue(({ setting, defaultValue, index }, next) => SettingsInstance.getItem(setting)
        .then(loadedSetting => this.emit('loaded', { setting, value: loadedSetting !== null ? loadedSetting : defaultValue }, ((index + 1) / total) * 100))
        .then(next)
        .catch(err => {
          this.emit('loaded', { setting, value: loadedSetting }, settingIndex / total)
          next()
        }))
      settingsLoader.drain = () => this.emit('finnished')

      Object.keys(defaultSettings).forEach((setting, index) => settingsLoader.push({ setting, defaultValue: defaultSettings[setting], index }))
    }
  }

  static get defaults() {
    return defaultSettings
  }
}

export default class Database {
  static teams = Teams
  static settings = Settings
}
