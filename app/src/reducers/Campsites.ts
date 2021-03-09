import { FitBoundsOptions } from 'leaflet'
import { MapProps } from 'react-leaflet'
import { Reducer } from 'redux'

import { State } from './Root'

/* Action Definition */
export const GET_CAMPSITES = 'GET_CAMPSITES'
export const GET_CAMPSITES_SUCCESS = 'GET_CAMPSITES_SUCCESS'
export const SET_CAMPGROUNDS = 'SET_CAMPSITES'
export const SET_RECREATION_AREAS = 'SET_RECREATION_AREAS'
export const GET_CAMPGROUND_AVAILABILITY = 'GET_CAMPGROUND_AVAILABILITY'
export const GET_CAMPGROUND_AVAILABILITY_SUCCESS = 'GET_CAMPGROUND_AVAILABILITY_SUCCESS'
export const GET_AUTOCOMPLETE = 'GET_AUTOCOMPLETE'
export const GET_AUTOCOMPLETE_SUCCESS = 'GET_AUTOCOMPLETE_SUCCESS'

export type Campsites = {
  autocompleteValues: RecreationArea[]
  campgrounds: Campground[]
}

export type RecreationArea = {
  city: string
  country_code: string
  entity_id: string
  entity_type: EntityType
  is_inventory: boolean
  name: string
  org_id: string
  org_name: string
  parent_entity_id: string
  parent_name: string
  state_code: string
}

export function isRecreationArea(obj: unknown): obj is RecreationArea {
  return (obj as RecreationArea).entity_id !== undefined
}

export enum EntityType {
  CAMPGROUND = 'campground',
  FACILITY = 'facility',
  REC_AREA = 'recarea',
  TICKET_FACILITY = 'ticketfacility'
}

export function entityTypeToString(entityType: EntityType) {
  switch (entityType) {
    case EntityType.CAMPGROUND:
      return 'Campground'
    case EntityType.FACILITY:
      return 'Facility'
    case EntityType.REC_AREA:
      return 'Recreation Area'
    case EntityType.TICKET_FACILITY:
      return 'Ticket Facility'
    default:
      return ''
  }
}

export type CampgroundRA = {
  addresses: Address[]
  average_rating: string
  campsite_equipment_name: string[]
  campsite_reserve_type: string[]
  campsites_count: string
  city: string
  country_code: string
  description: string
  entity_id: string
  entity_type: string
  latitude: number
  longitude: number
  name: string
  notices: string[]
  number_of_ratings: number
  org_id: string
  org_name: string
  parent_id: string
  parent_name: string
  price_range: {
    additional_desc: string
    amount_max: number
    amount_min: number
    per_unit: string
  }
  rate: CampsiteSeason[]
  reservable: boolean
  state_code: string
  type: ReservationType
  campsites?: Campsite[]
}

export function mapCampgroundRAtoCampground(campgroundRA: CampgroundRA) {
  const campground: Campground = {
    addresses: campgroundRA.addresses,
    campsites: campgroundRA.campsites,
    facility_id: campgroundRA.entity_id,
    facility_latitude: campgroundRA.latitude,
    facility_longitude: campgroundRA.longitude,
    facility_name: campgroundRA.name,
    facility_type: campgroundRA.type,
    parent_id: campgroundRA.parent_id
  }

  return campground
}

export type Campground = {
  addresses: Address[]
  campsites?: Campsite[]
  facility_id: string
  facility_latitude: number
  facility_longitude: number
  facility_name: string
  facility_type: ReservationType
  parent_id: string
}

export enum CampsiteType {
  TENT_ONLY_NONELECTRIC = 'TENT ONLY NONELECTRIC',
  MANAGEMENT = 'MANAGEMENT',
  STANDARD_NONELECTRIC = 'STANDARD NONELECTRIC'
}

export type Campsite = {
  availabilities: Map<string, ReservationStatus>
  campsite_id: string
  campsite_reserve_type: string
  campsite_type: CampsiteType
  capacity_rating: string
  loop: string
  max_num_people: number
  min_num_people: number
  site: string
  type_of_use: string
}

export enum ReservationType {
  STANDARD = 'STANDARD',
  CAMPING_LOTTERY = 'CAMPING_LOTTERY'
}

export enum ReservationStatus {
  AVAILABLE = 'Available',
  RESERVED = 'Reserved',
  NOT_RESERVABLE = 'Not Reservable'
}

export type CampsiteSeason = {
  end_date: Date
  season_description: string
  season_type: string
  start_date: Date
}

export type Address = {
  city: string
  country_code: string
  postal_code: string
  state_code: string
  street_address1: string
  street_address2: string
  street_address3: string
}

export type DaysOfWeek = {
  sunday: boolean
  monday: boolean
  tuesday: boolean
  wednesday: boolean
  thursday: boolean
  friday: boolean
  saturday: boolean
}

export enum DayOfWeek {
  SUNDAY = 'Sunday',
  MONDAY = 'Monday',
  TUESDAY = 'Tuesday',
  WEDNESDAY = 'Wednesday',
  THURSDAY = 'Thursday',
  FRIDAY = 'Friday',
  SATURDAY = 'Saturday'
}

export type Location = [number, number]

const maxReducer = (acc: number | null, next: number) => (acc ? (next > acc ? next : acc) : next)

const minReducer = (acc: number | null, next: number) => (acc ? (next < acc ? next : acc) : next)

export const campgroundsToLocations = (campgrounds: Campground[]): Location[] => {
  return campgrounds.map((campground: Campground) => [campground.facility_latitude, campground.facility_longitude])
}

export const getBounds = (locations: Location[]) => {
  const latitudes: number[] = locations.map((location) => location[0])
  const longitudes: number[] = locations.map((location) => location[1])

  const maxLat: number = latitudes.reduce(maxReducer, 0)
  const minLat: number = latitudes.reduce(minReducer, 0)
  const maxLong: number = longitudes.reduce(maxReducer, 0)
  const minLong: number = longitudes.reduce(minReducer, 0)

  if (maxLat && minLat && maxLong && minLong) {
    const topLeftCorner: Location = [minLat, maxLong]
    const bottomRightCorner: Location = [maxLat, minLong]
    return [topLeftCorner, bottomRightCorner]
  }
  return undefined
}

export const getLeafletProps = (locations: Location[]): Partial<MapProps> => {
  const oneLocation: Location | undefined = locations.length === 1 ? locations[0] : undefined

  if (oneLocation) {
    return { center: oneLocation, zoom: 12 }
  }

  const bounds: Location[] | undefined = getBounds(locations)
  const boundsOptions: FitBoundsOptions = { padding: [45, 45] }

  return { bounds, boundsOptions }
}

export function showDayOfWeek(daysOfWeek: DaysOfWeek, day: number): boolean {
  switch (day) {
    case 0:
      return daysOfWeek.sunday
    case 1:
      return daysOfWeek.monday
    case 2:
      return daysOfWeek.tuesday
    case 3:
      return daysOfWeek.wednesday
    case 4:
      return daysOfWeek.thursday
    case 5:
      return daysOfWeek.friday
    case 6:
      return daysOfWeek.saturday
    default:
      return false
  }
}

export function numDaysSelected(daysOfWeek: DaysOfWeek): number {
  return Object.values(daysOfWeek).reduce((a, b) => (b ? ++a : a), 0)
}

export const initialDaysOfWeek: DaysOfWeek = {
  sunday: false,
  monday: false,
  tuesday: false,
  wednesday: false,
  thursday: false,
  friday: false,
  saturday: false
}

export const initialCampsitesState: Campsites = {
  autocompleteValues: [],
  campgrounds: []
}

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
  }
}

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

export const campsitesSelectors = {
  getAutocomplete(state: State) {
    return state.campsites.autocompleteValues
  },
  getCampgrounds(state: State) {
    return state.campsites.campgrounds
  }
}
