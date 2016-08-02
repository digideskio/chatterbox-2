import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import _ from 'lodash'

import Chat from 'components/Chat'
import * as SettingsActions from 'actions/settings'
import * as MessageActions from 'actions/messages'
import * as TeamsActions from 'actions/teams'

function mapStateToProps({ settings, teams: { teams, activeTeamID }, messages: allMessages }) {
  const { activeChannelorDMID, users, user, channels, dms } = (teams[activeTeamID] || {})

  const channelUsers = _.get(channels, `${activeChannelorDMID}.members`) || _.get(dms, `${activeChannelorDMID}.members`)
  const channel = _.get(channels, activeChannelorDMID, {})
  const messages = _.get(allMessages, `${activeTeamID}.${activeChannelorDMID}`, [])

  return { settings, users, channel, channelUsers, user, messages }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    ...TeamsActions,
    ...SettingsActions,
    ...MessageActions
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(Chat)