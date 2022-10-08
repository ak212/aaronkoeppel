import {
  Campground,
  CampgroundRA,
  GET_AUTOCOMPLETE,
  GET_AUTOCOMPLETE_SUCCESS,
  GET_CAMPGROUND_AVAILABILITY,
  GET_CAMPGROUND_AVAILABILITY_SUCCESS,
  GET_CAMPSITES,
  GET_CAMPSITES_SUCCESS,
  RecreationArea,
  SET_CAMPGROUNDS,
  SET_RECREATION_AREAS,
} from './Campsites.types'

export const campsiteActions = {
  getCampsites: (entity_id: string) => {
    return { type: GET_CAMPSITES, entity_id }
  },
  getCampsitesSuccess: (values: CampgroundRA[]) => {
    return { type: GET_CAMPSITES_SUCCESS, values }
  },
  setCampgrounds: (campgrounds: Campground[]) => {
    return { type: SET_CAMPGROUNDS, campgrounds }
  },
  setRecreationAreas: (recAreas: RecreationArea[]) => {
    return { type: SET_RECREATION_AREAS, recAreas }
  },
  getCampgroundAvailability: (recreationAreas: RecreationArea[], startDate: number, endDate: number) => {
    return { type: GET_CAMPGROUND_AVAILABILITY, recreationAreas, startDate, endDate }
  },
  getCampgroundAvailabilitySuccess: (values: any[]) => {
    return { type: GET_CAMPGROUND_AVAILABILITY_SUCCESS, values }
  },
  getAutocomplete: (query: string) => {
    return { type: GET_AUTOCOMPLETE, query }
  },
  getAutocompleteSuccess: (values: RecreationArea[]) => {
    return { type: GET_AUTOCOMPLETE_SUCCESS, values }
  },
}
