import { range } from 'lodash'
import moment from 'moment'
import { all, call, delay, put, select, takeEvery, takeLatest } from 'redux-saga/effects'

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
   ReservationType,
   SET_RECREATION_AREAS
} from '../reducers/Campsites'
import { loadingActions } from '../reducers/Loading'
import CampsitesApi from '../remote/CampsitesApi'

const emptyRecreationAreas: RecreationArea[] = []

function* getCampsites({ entity_id }: ReturnType<typeof campsiteActions.getCampsites>) {
   const campsites = yield call(CampsitesApi.getCampgroundsForRecArea, entity_id)
   const campsiteValues: CampgroundRA[] = campsites["results"]
   yield put(campsiteActions.getCampsitesSuccess(campsiteValues))
}

function* getCampsiteAvailability({
   recreationAreas,
   startDate,
   endDate
}: ReturnType<typeof campsiteActions.getCampgroundAvailability>) {
   yield put(loadingActions.startLoading("campsiteTable"))

   const campgrounds: Campground[] = yield select(campsitesSelectors.getCampgrounds)

   const startMonth = moment(startDate).get("month")
   const endMonth = moment(endDate).get("month")
   /* Adding another +1 to endMonth because range is not inclusive */
   const monthRange = range(startMonth, endMonth + 1)
   for (const recreationArea of recreationAreas) {
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

         insertOrUpdateCampground(campgrounds, [campground])
         yield put(campsiteActions.setCampgrounds(campgrounds))
      } else {
         const recAreaCampgrounds = yield call(CampsitesApi.getCampgroundsForRecArea, recreationArea.entity_id)
         const campgroundValues: CampgroundRA[] = recAreaCampgrounds["results"]

         /* Set campgrounds when the number of campgrounds is known so the loading indicator is representitive of the final size */
         insertOrUpdateCampground(campgrounds, campgroundValues.map(mapCampgroundRAtoCampground))
         yield put(campsiteActions.setCampgrounds(campgrounds))

         for (let campground of campgroundValues) {
            const existingCampground = campgrounds.find((camp) => camp.facility_id === campground.entity_id)
            let campsites: Campsite[] =
               existingCampground && existingCampground.campsites ? existingCampground.campsites : []
            yield getCampsitesAvailability(campsites, campground.entity_id, startDate, monthRange)

            campgroundValues.splice(campgroundValues.indexOf(campground), 1, { ...campground, campsites })
         }
         insertOrUpdateCampground(campgrounds, campgroundValues.map(mapCampgroundRAtoCampground))
         yield put(campsiteActions.setCampgrounds(campgrounds))
      }
   }

   yield put(loadingActions.finishLoading("campsiteTable"))
}

function insertOrUpdateCampground(campgrounds: Campground[], campgroundsToAdd: Campground[]) {
   for (const campground of campgroundsToAdd) {
      const existingCampground = campgrounds.find((camp) => camp.facility_id === campground.facility_id)
      if (existingCampground) {
         campgrounds.splice(
            campgrounds.findIndex((campground) => campground.facility_id === existingCampground.facility_id),
            1,
            campground
         )
      } else {
         campgrounds.push(campground)
      }
   }
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

function* getAutocomplete({ query }: ReturnType<typeof campsiteActions.getAutocomplete>) {
   yield delay(250)
   if (query === "") {
      yield put(campsiteActions.getAutocompleteSuccess([]))
   } else {
      const autocompleteValues = yield call(CampsitesApi.getAutocomplete, query)
      const recAreas: RecreationArea[] = autocompleteValues["inventory_suggestions"]
      yield put(campsiteActions.getAutocompleteSuccess(recAreas || emptyRecreationAreas))
   }
}

function* setRecreationAreas({ recAreas }: ReturnType<typeof campsiteActions.setRecreationAreas>) {
   const campgrounds: Campground[] = yield select(campsitesSelectors.getCampgrounds)
   const filteredCampgrounds = campgrounds.filter((campground) =>
      recAreas.some(
         (recArea) => recArea.entity_id === campground.facility_id || recArea.entity_id === campground.parent_id
      )
   )
   if (campgrounds.length !== filteredCampgrounds.length) {
      yield put(campsiteActions.setCampgrounds(filteredCampgrounds))
   }
}

export function* campsitesSaga() {
   yield all([
      takeEvery(GET_CAMPSITES, getCampsites),
      takeEvery(GET_CAMPGROUND_AVAILABILITY, getCampsiteAvailability),
      takeLatest(GET_AUTOCOMPLETE, getAutocomplete),
      takeEvery(SET_RECREATION_AREAS, setRecreationAreas)
   ])
}
