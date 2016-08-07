import { push as locationPush } from 'react-router-redux'
import Notification from 'lib/notification'
import { remote } from 'electron'
import request from 'request'
import _ from 'lodash'
import path from 'path'
import mkdirp from 'mkdirp'
import fs from 'fs'

const teamIconTemp = path.join(remote.app.getPath('temp'), 'chatterbox', 'teamIcons')
const appIcon = path.join(__dirname, '../images/temp_logo.png')
mkdirp(teamIconTemp)

export function notifyNewMessage(teamID, channelID, userID, notificationText) {
  return (dispatch, getState) => {
    const {
      teams: {
        activeTeamID,
        teams: {
          [teamID]: {
            team: { image: teamImage, name: teamName },
            users: {
              [userID]: { handle: userHandle } = {}
            },
            dms,
            channels
          }
        }
      }
    } = getState()
    const isDM = Boolean(dms[channelID])
    const titleRest = isDM ? `from ${userHandle}` : `in ${_.get(channels, `${channelID}.name`, 'ERR_NO_NAME')}`

    new Promise((resolve, reject) => {
      if (teamImage) {
        const iconPath = path.join(teamIconTemp, teamID + path.extname(teamImage))
        fs.access(iconPath, fs.F_OK, (err) => {
          if (!err) {
            resolve(iconPath)
          } else {
            request(teamImage)
              .pipe(fs.createWriteStream(iconPath))
              .once('error', reject)
              .once('finish', () => resolve(iconPath))
          }
        })
      } else {
        resolve(appIcon)
      }
    }).then(iconPath => {
      const notifier = new Notification({
        title: `[${teamName}] ${titleRest}`,
        message: (!isDM ? `${userHandle}: ` : '') + notificationText,
        icon: iconPath,
      })
    })
  }
}
