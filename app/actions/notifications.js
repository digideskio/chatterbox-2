import { push as locationPush } from 'react-router-redux'
import Notification from 'lib/notification'
import { remote } from 'electron'
import request from 'request'
import path from 'path'
import mkdirp from 'mkdirp'
import fs from 'fs'

const teamIconTemp = path.join(remote.app.getPath('temp'), 'chatterbox', 'teamIcons')
const appIcon = path.join(__dirname, '../images/temp_logo.png')
console.log(teamIconTemp)
mkdirp(teamIconTemp)

export function notifyNewMessage(teamID, channelID, userID, notificationText) {
  return (dispatch, getState) => {
    const {
      teams: {
        activeTeamID,
        teams: {
          [teamID]: { team, users, dms, channels }
        }
      }
    } = getState()
    const { image: teamImage, name: teamName } = team
    const {
      [userID]: { handle: userHandle } = {}
    } = users
    const isDM = Boolean(dms[channelID])
    if (!isDM) {
      const {
        [channelID]: { name: channelName }
      } = channels
    }
    const titleRest = isDM ? `from ${userHandle}` : `in ${channelName}`

    new Promise((resolve, reject) => {
      if (teamImage) {
        const iconPath = path.join(teamIconTemp, teamID + path.extname(teamImage))
        console.log(iconPath)
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
