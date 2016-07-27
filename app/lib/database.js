import localforage from 'localforage'
import { queue } from 'async'
import { EventEmitter } from 'events'
import defaultSettings from './defaultSettings'

const TeamsInstance = localforage.createInstance({ name: 'teams', version: 1.0 })
const SettingsInstance = localforage.createInstance({ name: 'teams', version: 1.0 })

class SettingsLoader extends EventEmitter {
  constructor() {
    super()
    const { length: total } = Object.keys(defaultSettings)

    const loadingQueue = queue(({ setting, defaultValue, index }, next) => SettingsInstance.getItem(setting)
      .then(loadedSetting => this.emit('loaded', { setting, value: loadedSetting !== null ? loadedSetting : defaultValue }, ((index + 1) / total) * 100))
      .then(next)
      .catch(err => {
        this.emit('loaded', { setting, value: loadedSetting }, settingIndex / total)
        next()
      }))
    loadingQueue.drain = () => this.emit('finnished')

    Object.keys(defaultSettings).forEach((setting, index) => loadingQueue.push({ setting, defaultValue: defaultSettings[setting], index }))
  }
}

class TeamsLoader extends EventEmitter {
  constructor() {
    super()

    TeamsInstance.keys().then((keys) => {
      if (keys.length === 0) {
        this.emit('finnished', 0)
      } else {
        keys.forEach((key, idx) => {
          TeamsInstance.getItem(key).then(team => {
            this.emit('team', team)
            if ((idx + 1) === keys.length) {
              this.emit('finnished', keys.length)
            }
          })
        })
      }
    }).catch((err) => {
      console.error(err)
      this.emit('finnished', 0)
    })
  }
}

export default {
  teams: {
    add: ({ id, name, type, args }) => TeamsInstance.setItem(`${type}-${id}`, { id, name, type, args }),
    remove() {

    },
    Loader: TeamsLoader
  },

  settings: {
    change: (setting, value, callback) => SettingsInstance.setItem(setting, value, callback ? callback : null),
    Loader: SettingsLoader,
    defaults: defaultSettings
  }
}
