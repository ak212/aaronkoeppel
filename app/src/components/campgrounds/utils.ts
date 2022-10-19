import add from 'date-fns/add'
import format from 'date-fns/format'
import getDay from 'date-fns/getDay'
import toDate from 'date-fns/toDate'
import { Campground, DaysOfWeek, Location, ReservationStatus } from '../../store/campgrounds'

import { FitBoundsOptions, LatLngBoundsExpression } from 'leaflet'
import { MapContainerProps } from 'react-leaflet'

const maxReducer = (acc: number | null, next: number) => (acc ? (next > acc ? next : acc) : next)

const minReducer = (acc: number | null, next: number) => (acc ? (next < acc ? next : acc) : next)

export const campgroundsToLocations = (campgrounds: Campground[]): Location[] => {
  return campgrounds.map((campground: Campground) => [campground.facility_latitude, campground.facility_longitude])
}

export const getBounds = (locations: Location[]): LatLngBoundsExpression => {
  const latitudes: number[] = locations.map(location => location[0])
  const longitudes: number[] = locations.map(location => location[1])

  const maxLat: number = latitudes.reduce(maxReducer, 0)
  const minLat: number = latitudes.reduce(minReducer, 0)
  const maxLong: number = longitudes.reduce(maxReducer, 0)
  const minLong: number = longitudes.reduce(minReducer, 0)

  const topLeftCorner: Location = [minLat, maxLong]
  const bottomRightCorner: Location = [maxLat, minLong]
  return [topLeftCorner, bottomRightCorner]
}

export const getLeafletProps = (locations: Location[]): Partial<MapContainerProps> => {
  const oneLocation: Location | undefined = locations.length === 1 ? locations[0] : undefined

  if (oneLocation) {
    return { center: oneLocation, zoom: 12 }
  }

  const bounds: LatLngBoundsExpression = getBounds(locations)
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

/**
 * Get the individual days based on the date range.
 *
 * @returns {string[]}
 */
export const getDates = (
  startDate: number,
  endDate: number,
  advancedDate: boolean,
  daysOfWeek: DaysOfWeek,
): string[] => {
  const days: string[] = []
  for (let d = startDate; d < endDate; d = add(toDate(d), { days: 1 }).valueOf()) {
    days.push(format(d, 'yyyy-MM-dd').concat('T00:00:00Z'))
  }

  return days.filter(date => {
    if (advancedDate && numDaysSelected(daysOfWeek) > 0) {
      return showDayOfWeek(daysOfWeek, getDay(new Date(date)))
    } else return true
  })
}

/**
 * Creates a map between a date in the start/end range and the number of available campsites.
 *
 * @param {Campground} campground
 * @returns {Map<string, number>}
 */
export const campsitesAvailabilityRange = (
  startDate: number,
  endDate: number,
  advancedDate: boolean,
  daysOfWeek: DaysOfWeek,
  campground: Campground,
): Map<string, number> => {
  const days: string[] = getDates(startDate, endDate, advancedDate, daysOfWeek)
  const availabilities: Map<string, number> = new Map()
  for (const day of days) {
    let avail = 0
    if (campground.campsites) {
      for (const campsite of campground.campsites) {
        const statusMap: Map<string, ReservationStatus> = new Map(Object.entries(campsite.availabilities))
        if (statusMap.get(day) === ReservationStatus.AVAILABLE) {
          avail += 1
        }
      }
    }
    availabilities.set(format(new Date(day.replace('T00:00:00Z', '')), 'dd MMM yyyy'), avail)
  }
  return availabilities
}

export const campgroundAvailabileFully = (
  startDate: number,
  endDate: number,
  advancedDate: boolean,
  daysOfWeek: DaysOfWeek,
  campground: Campground,
) => {
  const campgroundAvailability: Map<string, number> = campsitesAvailabilityRange(
    startDate,
    endDate,
    advancedDate,
    daysOfWeek,
    campground,
  )

  return Array.from(campgroundAvailability.values())
    .map(available => available !== 0)
    .every(available => available)
}

export const campgroundAvailabilePartially = (
  startDate: number,
  endDate: number,
  advancedDate: boolean,
  daysOfWeek: DaysOfWeek,
  campground: Campground,
) => {
  const campgroundAvailability: Map<string, number> = campsitesAvailabilityRange(
    startDate,
    endDate,
    advancedDate,
    daysOfWeek,
    campground,
  )

  return Array.from(campgroundAvailability.values())
    .map(available => available !== 0)
    .some(available => available)
}
