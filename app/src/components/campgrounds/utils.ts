import add from 'date-fns/add'
import format from 'date-fns/format'
import getDay from 'date-fns/getDay'
import toDate from 'date-fns/toDate'
import {
  AvailablityByDate,
  Campground,
  CampgroundAvailability,
  DaysOfWeek,
  Location,
  ReservationStatus,
} from '../../store/campgrounds'

import { FitBoundsOptions, LatLngBoundsExpression } from 'leaflet'
import { useMemo } from 'react'
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

/**
 * It takes an object with boolean values and returns the number of true values
 * @param {DaysOfWeek} daysOfWeek - DaysOfWeek = {
 * @returns The number of days selected.
 */
export function numDaysSelected(daysOfWeek: DaysOfWeek): number {
  return Object.values(daysOfWeek).reduce((a, b) => (b ? ++a : a), 0)
}

/**
 * It parses the dates selected and filters out specific days of the week if the user has selected them.
 * @param {number} startDate - number,
 * @param {number} endDate - number - the end date in milliseconds
 * @param {boolean} advancedDate - boolean - whether or not to use day of week filtering
 * @param {DaysOfWeek} daysOfWeek - {
 * @returns An array of date strings.
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
 * It takes a start date, end date, advanced date, days of week, campground, and advanced mapping and
 * returns a campground availability
 * @param {number} startDate - number,
 * @param {number} endDate - number,
 * @param {boolean} advancedDate - boolean - if true, will only return availability for the days of the
 * week specified in daysOfWeek
 * @param {DaysOfWeek} daysOfWeek - DaysOfWeek = {
 * @param {Campground} campground - Campground = {
 * @param {boolean} [advancedMapping] - boolean - if true, it will return an array of sites that are
 * available for all dates, and an array of sites that are never available.
 * @returns An object with three properties:
 */
export const campsitesAvailabilityRange = (
  startDate: number,
  endDate: number,
  advancedDate: boolean,
  daysOfWeek: DaysOfWeek,
  campground: Campground,
  advancedMapping?: boolean,
): CampgroundAvailability => {
  const days: string[] = getDates(startDate, endDate, advancedDate, daysOfWeek)
  const availabilityMap: Map<string, AvailablityByDate> = new Map()
  const allCampsites = campground.campsites?.map(campsite => campsite.site) || []
  const sitesAvailableAllDates: string[] = []
  const sitesAvailableNoDates: string[] = []

  for (const day of days) {
    let avail = 0
    const availableSites: string[] = []

    if (campground.campsites) {
      for (const campsite of campground.campsites) {
        const statusMap: Map<string, ReservationStatus> = new Map(Object.entries(campsite.availabilities))
        if (statusMap.get(day) === ReservationStatus.AVAILABLE) {
          avail += 1
          availableSites.push(campsite.site)
        }
      }
    }
    availabilityMap.set(format(new Date(day.replace('T00:00:00Z', '')), 'dd MMM yyyy'), {
      count: avail,
      sitesAvailableCurrentDate: availableSites.sort((a, b) => (a > b ? 1 : -1)),
    })
  }

  if (advancedMapping) {
    sitesAvailableAllDates.push(
      ...allCampsites
        .filter(campsite => campsiteAvailableFully(campsite, availabilityMap))
        .sort((a, b) => (a > b ? 1 : -1)),
    )

    sitesAvailableNoDates.push(
      ...allCampsites
        .filter(campsite => campsiteAvailableNever(campsite, availabilityMap))
        .sort((a, b) => (a > b ? 1 : -1)),
    )

    for (const day of availabilityMap.keys()) {
      const availability = availabilityMap.get(day)
      if (availability) {
        const sitesAvailable = availability?.sitesAvailableCurrentDate?.filter(
          site => !sitesAvailableAllDates.includes(site),
        )
        availabilityMap.set(day, { ...availability, sitesAvailableCurrentDate: sitesAvailable })
      }
    }
  }

  return { availabilityByDate: availabilityMap, sitesAvailableAllDates, sitesAvailableNoDates }
}

/**
 * "Given a site and a map of availabilities, return true if the site is available on every date in the
 * map."
 *
 * @param {string} site - string - the site number you want to check
 * @param availabilities - Map<string, AvailablityByDate>
 * @returns A boolean value.
 */
const campsiteAvailableFully = (site: string, availabilities: Map<string, AvailablityByDate>): boolean => {
  return Array.from(availabilities.values())
    .map(a => a.sitesAvailableCurrentDate)
    .every(s => s?.includes(site))
}

/**
 * It takes a campsite name and a map of availabilities, and returns true if the campsite is never
 * available
 * @param {string} site - string - the site you want to check
 * @param availabilities - Map<string, AvailablityByDate>
 * @returns A boolean value.
 */
const campsiteAvailableNever = (site: string, availabilities: Map<string, AvailablityByDate>): boolean => {
  return Array.from(availabilities.values())
    .map(a => a.sitesAvailableCurrentDate)
    .every(s => !s?.includes(site))
}

/**
 * Given a start date, end date, advanced date, days of week, and campground, return true if all dates
 * in the range are available, false otherwise.
 * @param {number} startDate - number,
 * @param {number} endDate - number,
 * @param {boolean} advancedDate - boolean
 * @param {DaysOfWeek} daysOfWeek - DaysOfWeek = {
 * @param {Campground} campground - Campground = {
 * @returns A boolean value.
 */
export const campgroundAvailabileFully = (
  startDate: number,
  endDate: number,
  advancedDate: boolean,
  daysOfWeek: DaysOfWeek,
  campground: Campground,
): boolean => {
  const campgroundAvailability: CampgroundAvailability = useMemo(
    () => campsitesAvailabilityRange(startDate, endDate, advancedDate, daysOfWeek, campground),
    [startDate, endDate, advancedDate, daysOfWeek, campground],
  )

  return Array.from(campgroundAvailability.availabilityByDate.values())
    .map(available => available.count !== 0)
    .every(available => available)
}

/**
 * Given a start date, end date, advanced date, days of week, and a campground, return true if there is
 * at least one campsite available for at least one day in the range.
 * @param {number} startDate - number,
 * @param {number} endDate - number,
 * @param {boolean} advancedDate - boolean
 * @param {DaysOfWeek} daysOfWeek - DaysOfWeek = {
 * @param {Campground} campground - Campground = {
 * @returns A boolean value.
 */
export const campgroundAvailabilePartially = (
  startDate: number,
  endDate: number,
  advancedDate: boolean,
  daysOfWeek: DaysOfWeek,
  campground: Campground,
): boolean => {
  const campgroundAvailability: CampgroundAvailability = useMemo(
    () => campsitesAvailabilityRange(startDate, endDate, advancedDate, daysOfWeek, campground),
    [startDate, endDate, advancedDate, daysOfWeek, campground],
  )

  return Array.from(campgroundAvailability.availabilityByDate.values())
    .map(available => available.count !== 0)
    .some(available => available)
}
