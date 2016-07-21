import localforage from 'localforage'
import { EventEmitter } from 'events'

const TeamsInstance = localforage.createInstance({ name: 'teams', version: 1.0, driver: localforage.WEBSQL })
const SettingsInstance = localforage.createInstance({ name: 'teams', version: 1.0, driver: localforage.WEBSQL })


class Teams {
  static addTeam() {

  }

  static removeTeamByID() {

  }

  static getByID() {

  }

  static get all() {

  }
}


class Settings {
  static change(setting, value, callback) {
    return SettingsInstance.setItem(setting, value, callback ? callback : null)
  }

  static Loader() {
    return class settingsEmitter extends EventEmitter {
      constructor() {
        super()

      }
    }
  }

  static get defaults() {
    return {
      theme: 'light',
      closeToTray: true
    }
  }
}

export default class Database {
  static teams = Teams
  static settings = Settings
}
