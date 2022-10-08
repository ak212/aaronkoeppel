import { State } from '../../reducers/Root'

export const campsitesSelectors = {
  getAutocomplete(state: State) {
    return state.campsites.autocompleteValues
  },
  getCampgrounds(state: State) {
    return state.campsites.campgrounds
  },
}
