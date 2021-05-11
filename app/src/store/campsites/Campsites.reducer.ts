import { Reducer } from 'redux'

import { Campsites, GET_AUTOCOMPLETE_SUCCESS, initialCampsitesState, SET_CAMPGROUNDS } from './Campsites.types'

export const campsitesReducer: Reducer<Campsites> = (state = initialCampsitesState, action): Campsites => {
  switch (action.type) {
    case GET_AUTOCOMPLETE_SUCCESS:
      return { ...state, autocompleteValues: action.values }
    case SET_CAMPGROUNDS:
      return { ...state, campgrounds: action.campgrounds }
    default:
      return state
  }
}
