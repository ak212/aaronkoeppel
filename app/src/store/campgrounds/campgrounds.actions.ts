import { createAction } from '@reduxjs/toolkit'
import { Campground, CampgroundRA, RecreationArea } from './campgrounds.types'

/* Action Definition */
const PREFIX = 'campgrounds'
export const GET_CAMPSITES = `${PREFIX}/getCampsites`
export const GET_CAMPSITES_SUCCESS = `${PREFIX}/getCampsitesSuccess`
export const SET_CAMPGROUNDS = `${PREFIX}/setCampsites`
export const SET_RECREATION_AREAS = `${PREFIX}/setRecreationAreas`
export const GET_CAMPGROUND_AVAILABILITY = `${PREFIX}/getCampgroundAvailability`
export const GET_CAMPGROUND_AVAILABILITY_SUCCESS = `${PREFIX}/getCampgroundAvailabilitySuccess`
export const GET_AUTOCOMPLETE = `${PREFIX}/getAutoComplete`
export const GET_AUTOCOMPLETE_SUCCESS = `${PREFIX}/getAutoCompleteSuccess`

export const getCampsites = createAction(GET_CAMPSITES, function prepare(entity_id: string) {
  return {
    payload: {
      entity_id,
    },
  }
})

export const getCampsitesSuccess = createAction(GET_CAMPSITES_SUCCESS, function prepare(values: CampgroundRA[]) {
  return {
    payload: {
      values,
    },
  }
})

export const setCampgrounds = createAction(SET_CAMPGROUNDS, function prepare(campgrounds: Campground[]) {
  return {
    payload: {
      campgrounds,
    },
  }
})

export const setRecreationAreas = createAction(SET_RECREATION_AREAS, function prepare(recAreas: RecreationArea[]) {
  return {
    payload: {
      recAreas,
    },
  }
})

export const getCampgroundAvailability = createAction(
  GET_CAMPGROUND_AVAILABILITY,
  function prepare(recreationAreas: RecreationArea[], startDate: number, endDate: number) {
    return {
      payload: {
        recreationAreas,
        startDate,
        endDate,
      },
    }
  },
)

export const getCampgroundAvailabilitySuccess = createAction(
  GET_CAMPGROUND_AVAILABILITY_SUCCESS,
  function prepare(values: any[]) {
    return {
      payload: {
        values,
      },
    }
  },
)

export const getAutocomplete = createAction(GET_AUTOCOMPLETE, function prepare(query: string) {
  return {
    payload: {
      query,
    },
  }
})

export const getAutocompleteSuccess = createAction(
  GET_AUTOCOMPLETE_SUCCESS,
  function prepare(values: RecreationArea[]) {
    return {
      payload: {
        values,
      },
    }
  },
)
