import { push as locationPush } from 'react-router-redux'
import Notification from 'lib/notification'

export function notifyNewMessage(team, channel, message) {
  return (dispatch, getState) => {
    const { teams: { activeTeamID }, teams } = getState()

    const notifier = new Notification({
      title: `New message from TEST`,
      message: 'lalalala'
    })
  }
}
