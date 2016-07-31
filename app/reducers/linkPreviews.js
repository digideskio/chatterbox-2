import { LINK_PREVIEW_ADD } from 'actions/linkPreviews'

const defaultState = {/*
  [link]: 'path/in/appdata'
*/}

export default function linkPreviews(state = defaultState, { type, payload }) {
  switch (type) {
    case LINK_PREVIEW_ADD: {
      const { link, src } = payload
      return {...state, [link] : src}
    }
    default:
      return state
  }
}
