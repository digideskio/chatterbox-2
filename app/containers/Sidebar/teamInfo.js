import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { pickBy } from 'lodash'

import TeamInfo from 'components/sidebar/teamInfo'
import * as SettingsActions from 'actions/settings'
import * as TeamsActions from 'actions/teams'

const mapStateToProps = ({ settings, teams: { teams, activeTeamID }, messages }) => {
  const { activeChannelorDMID, user, channels, dms, team } = (teams[activeTeamID] || {})
  const joinedChannels = pickBy(channels, 'isMember')
  const joinedDMs = pickBy(dms, 'isOpen')

  return {
    channels: joinedChannels,
    dms: joinedDMs,
    user,
    team,
    activeChannelorDMID
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    ...TeamsActions,
    ...SettingsActions
  }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(TeamInfo)
