import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import _ from 'lodash'

import TeamInfo from 'components/Sidebar/TeamInfo'
import * as SettingsActions from 'actions/settings'
import * as TeamsActions from 'actions/teams'


function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    ...TeamsActions,
    ...SettingsActions
  }, dispatch)
}

function mapStateToTeamInfoProps({ settings, teams: { teams, activeTeamID }, messages }) {
  const { activeChannelorDMID, user, channels, dms, team } = (teams[activeTeamID] || {})
  const joinedChannels = _.pickBy(channels, 'isMember')
  const joinedDMs = _.pickBy(dms, 'isOpen')

  return { channels: joinedChannels, dms: joinedDMs, user, team, activeChannelorDMID }
}

export default connect(mapStateToTeamInfoProps, mapDispatchToProps)(TeamInfo)
