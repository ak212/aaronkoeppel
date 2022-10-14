import { createReducer } from '@reduxjs/toolkit'
import { getAutocompleteSuccess, setCampgrounds } from './Campsites.actions'

import { initialCampsitesState } from './Campsites.types'

export const campsitesReducer = createReducer(initialCampsitesState, builder => {
  builder
    .addCase(setCampgrounds, (state, action) => {
      state.campgrounds = action.payload.campgrounds
    })
    .addCase(getAutocompleteSuccess, (state, action) => {
      state.autocompleteValues = action.payload.values
    })
})
