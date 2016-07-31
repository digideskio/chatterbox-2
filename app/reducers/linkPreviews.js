import { LINK_PREVIEW_ADD, LINK_PREVIEW_LOADING } from 'actions/linkPreviews'
import { without } from 'lodash'

const defaultState = {
  loading: [ /* 'url' */ ],
  loaded: {
    /*
      [link]: 'path/in/appdata'
    */
  }
}

export default function linkPreviews(state = defaultState, { type, payload }) {
  switch (type) {
    case LINK_PREVIEW_ADD:
      const newState = {...state }
      const { link, src } = payload
      newState.loaded[link] = src
      newState.loading = without(link)
      return newState
    case LINK_PREVIEW_LOADING:
      return {...state, loading: [...state.loading, payload] }
    default:
      return state
  }
}
