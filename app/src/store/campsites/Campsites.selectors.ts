import { RootState } from '../../state/store'

export const campsitesSelectors = {
  getAutocomplete(state: RootState) {
    return state.campsites.autocompleteValues
  },
  getCampgrounds(state: RootState) {
    return state.campsites.campgrounds
  },
}
