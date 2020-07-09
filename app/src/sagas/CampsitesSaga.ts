import { all, call, put, takeEvery } from 'redux-saga/effects'

import {
   Campground,
   CampgroundRA,
   Campsite,
   campsiteActions,
   CampsiteType,
   EntityType,
   GET_AUTOCOMPLETE,
   GET_CAMPSITE_AVAILABILITY,
   GET_CAMPSITES,
   mapCampgroundRAtoCampground,
   RecreationArea,
   ReservationType
} from '../reducers/Campsites'
import { loadingActions } from '../reducers/Loading'
import CampsitesApi from '../remote/CampsitesApi'

function* getCampsites({ entity_id }: ReturnType<typeof campsiteActions.getCampsites>) {
   const campsites = yield call(CampsitesApi.getCampgroundsForRecArea, entity_id)
   const campsiteValues: CampgroundRA[] = campsites["results"]
   yield put(campsiteActions.getCampsitesSuccess(campsiteValues))
}

function* getCampsiteAvailability({
   recreationArea,
   startDate,
   endDate
}: ReturnType<typeof campsiteActions.getCampsiteAvailability>) {
   yield put(loadingActions.startLoading("campsiteTable"))
   // TODO use end date to see if multiple months need to be obtained
   if (recreationArea.entity_type === EntityType.CAMPGROUND) {
      const campgroundObj = yield call(CampsitesApi.getCampground, recreationArea.entity_id)
      let campground: Campground = campgroundObj["campground"]
      if (campground.facility_type !== ReservationType.CAMPING_LOTTERY) {
         const campsitesObj = yield call(CampsitesApi.getCampsiteAvailablity, recreationArea.entity_id, startDate)
         const campsiteMap = campsitesObj["campsites"]
         let campsites: Campsite[] = Object.keys(campsiteMap).map((key) => campsiteMap[key])
         campsites = campsites.filter((campsite) => campsite.campsite_type !== CampsiteType.MANAGEMENT)
         campground = { ...campground, campsites }
      }
      yield put(campsiteActions.setCampgrounds([{ ...campground }]))
   } else {
      const campgrounds = yield call(CampsitesApi.getCampgroundsForRecArea, recreationArea.entity_id)
      const campgroundValues: CampgroundRA[] = campgrounds["results"]
      yield put(campsiteActions.setCampgrounds(campgroundValues.map(mapCampgroundRAtoCampground)))
      for (let campground of campgroundValues) {
         const campsitesObj = yield call(CampsitesApi.getCampsiteAvailablity, campground.entity_id, startDate)
         const campsiteMap = campsitesObj["campsites"]
         let campsites: Campsite[] = Object.keys(campsiteMap).map((key) => campsiteMap[key])
         campsites = campsites.filter((campsite) => campsite.campsite_type !== CampsiteType.MANAGEMENT)
         campgroundValues.splice(campgroundValues.indexOf(campground), 1, { ...campground, campsites })
      }
      yield put(campsiteActions.setCampgrounds(campgroundValues.map(mapCampgroundRAtoCampground)))
   }
   yield put(loadingActions.finishLoading("campsiteTable"))
}

function* getAutoComplete({ query }: ReturnType<typeof campsiteActions.getAutocomplete>) {
   if (query === "") {
      yield put(campsiteActions.getAutocompleteSuccess([]))
   } else {
      const autocompleteValues = yield call(CampsitesApi.getAutocomplete, query)
      const recAreas: RecreationArea[] = autocompleteValues["inventory_suggestions"]
      yield put(campsiteActions.getAutocompleteSuccess(recAreas))
   }
}

export function* campsitesSaga() {
   yield all([
      takeEvery(GET_CAMPSITES, getCampsites),
      takeEvery(GET_CAMPSITE_AVAILABILITY, getCampsiteAvailability),
      takeEvery(GET_AUTOCOMPLETE, getAutoComplete)
   ])
}
