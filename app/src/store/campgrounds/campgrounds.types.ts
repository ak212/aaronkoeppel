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
  TICKET_FACILITY = 'ticketfacility',
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
    parent_id: campgroundRA.parent_id,
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
  STANDARD_NONELECTRIC = 'STANDARD NONELECTRIC',
}

export type CampgroundAvailability = {
  availabilityByDate: Map<string, AvailablityByDate>
  sitesAvailableAllDates?: string[]
  sitesAvailableNoDates?: string[]
}

export type AvailablityByDate = {
  count: number
  sitesAvailableCurrentDate?: string[]
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
  CAMPING_LOTTERY = 'CAMPING_LOTTERY',
}

export enum ReservationStatus {
  AVAILABLE = 'Available',
  RESERVED = 'Reserved',
  NOT_RESERVABLE = 'Not Reservable',
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
  SATURDAY = 'Saturday',
}

export type Location = [number, number]

export const initialDaysOfWeek: DaysOfWeek = {
  sunday: false,
  monday: false,
  tuesday: false,
  wednesday: false,
  thursday: false,
  friday: false,
  saturday: false,
}

export const initialCampsitesState: Campsites = {
  autocompleteValues: [],
  campgrounds: [],
}
