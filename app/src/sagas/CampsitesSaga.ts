import { range } from 'lodash'
import moment from 'moment'
import { all, call, put, select, takeEvery } from 'redux-saga/effects'

import {
   Campground,
   CampgroundRA,
   Campsite,
   campsiteActions,
   campsitesSelectors,
   CampsiteType,
   EntityType,
   GET_AUTOCOMPLETE,
   GET_CAMPGROUND_AVAILABILITY,
   GET_CAMPSITES,
   mapCampgroundRAtoCampground,
   RecreationArea,
   ReservationStatus,
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
}: ReturnType<typeof campsiteActions.getCampgroundAvailability>) {
   yield put(loadingActions.startLoading("campsiteTable"))

   const campgrounds: Campground[] = yield select(campsitesSelectors.getCampgrounds)

   const startMonth = moment(startDate).get("month")
   const endMonth = moment(endDate).get("month")
   /* Adding another +1 to endMonth because range is not inclusive */
   const monthRange = range(startMonth, endMonth + 1)

   if (recreationArea.entity_type === EntityType.CAMPGROUND) {
      const campgroundObj = yield call(CampsitesApi.getCampground, recreationArea.entity_id)
      let campground: Campground = campgroundObj["campground"]
      const existingCampground = campgrounds.find((camp) => camp.facility_id === recreationArea.entity_id)

      if (campground.facility_type !== ReservationType.CAMPING_LOTTERY) {
         let campsites: Campsite[] =
            existingCampground && existingCampground.campsites ? existingCampground.campsites : []
         yield getCampsitesAvailability(campsites, recreationArea.entity_id, startDate, monthRange)

         campground = { ...campground, campsites }
      }

      yield put(campsiteActions.setCampgrounds([campground]))
   } else {
      const recAreaCampgrounds = yield call(CampsitesApi.getCampgroundsForRecArea, recreationArea.entity_id)
      const campgroundValues: CampgroundRA[] = recAreaCampgrounds["results"]

      /* Set campgrounds when the number of campgrounds is known so the loading indicator is representitive of the final size */
      yield put(campsiteActions.setCampgrounds(campgroundValues.map(mapCampgroundRAtoCampground)))

      for (let campground of campgroundValues) {
         const existingCampground = campgrounds.find((camp) => camp.facility_id === campground.entity_id)
         let campsites: Campsite[] =
            existingCampground && existingCampground.campsites ? existingCampground.campsites : []
         yield getCampsitesAvailability(campsites, campground.entity_id, startDate, monthRange)

         campgroundValues.splice(campgroundValues.indexOf(campground), 1, { ...campground, campsites })
      }
      yield put(campsiteActions.setCampgrounds(campgroundValues.map(mapCampgroundRAtoCampground)))
   }

   yield put(loadingActions.finishLoading("campsiteTable"))
}

function* getCampsitesAvailability(campsites: Campsite[], entity_id: string, startDate: number, monthRange: number[]) {
   for (const month of monthRange) {
      const campsitesObj = yield call(
         CampsitesApi.getCampgroundAvailablity,
         entity_id,
         moment(startDate).set("month", month).valueOf()
      )
      const campsiteMap = campsitesObj["campsites"]
      Object.keys(campsiteMap).forEach((entry) => {
         const mapCampsite: Campsite = campsiteMap[entry]
         const index = campsites.findIndex((campsite) => campsite.campsite_id === mapCampsite.campsite_id)
         if (index !== -1) {
            const statusMap: Map<string, ReservationStatus> = new Map(Object.entries(mapCampsite.availabilities))
            const campsitesMap: Map<string, ReservationStatus> = new Map(
               Object.entries(campsites[index].availabilities)
            )

            const availabilities = new Map([...campsitesMap, ...statusMap])
            const availabilitiesObj: { [k: string]: any } = {}
            for (const k of availabilities.keys()) {
               availabilitiesObj[k] = availabilities.get(k)
            }

            const newCampsite = {
               ...campsites[index],
               availabilities: availabilitiesObj as Map<string, ReservationStatus>
            }
            campsites.splice(index, 1, newCampsite)
         } else if (mapCampsite.campsite_type !== CampsiteType.MANAGEMENT) {
            campsites.push(mapCampsite)
         }
      })
   }
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
      takeEvery(GET_CAMPGROUND_AVAILABILITY, getCampsiteAvailability),
      takeEvery(GET_AUTOCOMPLETE, getAutoComplete)
   ])
}
