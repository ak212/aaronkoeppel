import getMonth from 'date-fns/getMonth'
import setMonth from 'date-fns/setMonth'
import cloneDeep from 'lodash/cloneDeep'
import range from 'lodash/range'
import { all, call, delay, put, select, takeEvery, takeLatest } from 'redux-saga/effects'

import CampsitesApi from '../remote/CampsitesApi'
import { finishLoading, startLoading } from '../state/Loading'
import {
  Campground,
  CampgroundRA,
  Campsite,
  campsitesSelectors,
  CampsiteType,
  EntityType,
  getAutocomplete,
  getAutocompleteSuccess,
  getCampgroundAvailability,
  getCampsites,
  getCampsitesSuccess,
  GET_AUTOCOMPLETE,
  GET_CAMPGROUND_AVAILABILITY,
  GET_CAMPSITES,
  mapCampgroundRAtoCampground,
  RecreationArea,
  ReservationStatus,
  ReservationType,
  setCampgrounds,
  setRecreationAreas,
  SET_RECREATION_AREAS,
} from '../store/campsites'

const emptyRecreationAreas: RecreationArea[] = []

function* getCampsitesGenerator({ payload: { entity_id } }: ReturnType<typeof getCampsites>) {
  const campsites: { results: CampgroundRA[] } = yield call(CampsitesApi.getCampgroundsForRecArea, entity_id)
  const campsiteValues: CampgroundRA[] = campsites['results'] as CampgroundRA[]
  yield put(getCampsitesSuccess(campsiteValues))
}

function* getCampgroundAvailabilityGenerator({
  payload: { recreationAreas, startDate, endDate },
}: ReturnType<typeof getCampgroundAvailability>) {
  yield put(startLoading('campsiteTable'))

  const selectorCampgrounds: Campground[] = yield select(campsitesSelectors.getCampgrounds)
  const campgrounds: Campground[] = cloneDeep(selectorCampgrounds)

  const startMonth = getMonth(startDate)
  const endMonth = getMonth(endDate)
  /* Adding another +1 to endMonth because range is not inclusive */
  const monthRange = range(startMonth, endMonth + 1)
  for (const recreationArea of recreationAreas) {
    if (recreationArea.entity_type === EntityType.CAMPGROUND) {
      const campgroundObj: { campground: Campground } = yield call(CampsitesApi.getCampground, recreationArea.entity_id)
      let campground: Campground = cloneDeep(campgroundObj['campground'])
      const existingCampground = campgrounds.find(camp => camp.facility_id === recreationArea.entity_id)

      if (campground.facility_type !== ReservationType.CAMPING_LOTTERY) {
        const campsites: Campsite[] =
          existingCampground && existingCampground.campsites ? existingCampground.campsites : []
        yield getCampsitesAvailability(campsites, recreationArea.entity_id, startDate, monthRange)

        campground = { ...campground, campsites }
      }

      insertOrUpdateCampground(campgrounds, [campground])
      yield put(setCampgrounds(campgrounds))
    } else {
      const recAreaCampgrounds: { results: CampgroundRA[] } = yield call(
        CampsitesApi.getCampgroundsForRecArea,
        recreationArea.entity_id,
      )
      const campgroundValues: CampgroundRA[] = cloneDeep(recAreaCampgrounds['results'])

      /* Set campgrounds when the number of campgrounds is known so the loading indicator is representitive of the final size */
      insertOrUpdateCampground(campgrounds, campgroundValues.map(mapCampgroundRAtoCampground))
      yield put(setCampgrounds(campgrounds))

      for (const campground of campgroundValues) {
        const existingCampground = campgrounds.find(camp => camp.facility_id === campground.entity_id)
        const campsites: Campsite[] =
          existingCampground && existingCampground.campsites ? existingCampground.campsites : []
        yield getCampsitesAvailability(campsites, campground.entity_id, startDate, monthRange)

        campgroundValues.splice(campgroundValues.indexOf(campground), 1, { ...campground, campsites })
      }
      const updatedCampgrounds = cloneDeep(campgrounds)
      insertOrUpdateCampground(updatedCampgrounds, campgroundValues.map(mapCampgroundRAtoCampground))
      yield put(setCampgrounds(updatedCampgrounds))
    }
  }

  yield put(finishLoading('campsiteTable'))
}

function insertOrUpdateCampground(campgrounds: Campground[], campgroundsToAdd: Campground[]) {
  for (const campground of campgroundsToAdd) {
    const existingCampground = campgrounds.find(camp => camp.facility_id === campground.facility_id)
    if (existingCampground) {
      campgrounds.splice(
        campgrounds.findIndex(campground => campground.facility_id === existingCampground.facility_id),
        1,
        campground,
      )
    } else {
      campgrounds.push(campground)
    }
  }
}

function* getCampsitesAvailability(campsites: Campsite[], entity_id: string, startDate: number, monthRange: number[]) {
  for (const month of monthRange) {
    const campsitesObj: { campsites: { [entry: string]: Campsite } } = yield call(
      CampsitesApi.getCampgroundAvailablity,
      entity_id,
      setMonth(startDate, month).valueOf(),
    )

    const campsiteMap = cloneDeep(campsitesObj['campsites'])
    Object.keys(campsiteMap).forEach(entry => {
      const mapCampsite: Campsite = campsiteMap[entry]
      const index = campsites.findIndex(campsite => campsite.campsite_id === mapCampsite.campsite_id)
      if (index !== -1) {
        const statusMap: Map<string, ReservationStatus> = new Map(Object.entries(mapCampsite.availabilities))
        const campsitesMap: Map<string, ReservationStatus> = new Map(Object.entries(campsites[index].availabilities))

        const availabilities = new Map([...campsitesMap, ...statusMap])
        const availabilitiesObj: { [k: string]: any } = {}
        for (const k of availabilities.keys()) {
          availabilitiesObj[k] = availabilities.get(k)
        }

        const newCampsite = {
          ...campsites[index],
          availabilities: availabilitiesObj as Map<string, ReservationStatus>,
        }
        campsites.splice(index, 1, newCampsite)
      } else if (mapCampsite.campsite_type !== CampsiteType.MANAGEMENT) {
        campsites.push(mapCampsite)
      }
    })
  }
}

function* getAutocompleteGenerator({ payload: { query } }: ReturnType<typeof getAutocomplete>) {
  yield delay(250)
  if (query === '') {
    yield put(getAutocompleteSuccess([]))
  } else {
    const autocompleteValues: { inventory_suggestions: RecreationArea[] } = yield call(
      CampsitesApi.getAutocomplete,
      query,
    )
    const recAreas: RecreationArea[] = autocompleteValues['inventory_suggestions']
    yield put(getAutocompleteSuccess(recAreas || emptyRecreationAreas))
  }
}

function* setRecreationAreasGenerator({ payload: { recAreas } }: ReturnType<typeof setRecreationAreas>) {
  const campgrounds: Campground[] = yield select(campsitesSelectors.getCampgrounds)
  const filteredCampgrounds = campgrounds.filter(campground =>
    recAreas.some(
      recArea => recArea.entity_id === campground.facility_id || recArea.entity_id === campground.parent_id,
    ),
  )
  if (campgrounds.length !== filteredCampgrounds.length) {
    yield put(setCampgrounds(filteredCampgrounds))
  }
}

export function* campsitesSaga() {
  yield all([
    takeEvery(GET_CAMPSITES, getCampsitesGenerator),
    takeEvery(GET_CAMPGROUND_AVAILABILITY, getCampgroundAvailabilityGenerator),
    takeLatest(GET_AUTOCOMPLETE, getAutocompleteGenerator),
    takeEvery(SET_RECREATION_AREAS, setRecreationAreasGenerator),
  ])
}
