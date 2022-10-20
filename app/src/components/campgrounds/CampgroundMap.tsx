import * as L from 'leaflet'
import startCase from 'lodash/startCase'
import uniqueId from 'lodash/uniqueId'
import React from 'react'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import { Campground, DaysOfWeek } from '../../store/campgrounds'
import {
  campgroundAvailabileFully,
  campgroundAvailabilePartially,
  campgroundsToLocations,
  getLeafletProps,
} from './utils'

interface Props {
  advancedDate: boolean
  campgrounds: Campground[]
  daysOfWeek: DaysOfWeek
  endDate: number
  startDate: number

  onClick(facilityId: string): void
}

const greenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

const greyIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

const yellowIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

interface CampgroundMarkerProps {
  advancedDate: boolean
  campground: Campground
  daysOfWeek: DaysOfWeek
  endDate: number
  startDate: number

  onClick(facilityId: string): void
}

const CampgroundMarker = ({
  advancedDate,
  campground,
  daysOfWeek,
  endDate,
  startDate,
  onClick,
}: CampgroundMarkerProps) => {
  const icon = campgroundAvailabileFully(startDate, endDate, advancedDate, daysOfWeek, campground)
    ? greenIcon
    : campgroundAvailabilePartially(startDate, endDate, advancedDate, daysOfWeek, campground)
    ? yellowIcon
    : greyIcon

  return (
    <Marker
      key={campground.facility_id}
      position={[campground.facility_latitude, campground.facility_longitude]}
      icon={icon}
      eventHandlers={{
        click: () => {
          onClick(campground.facility_id)
        },
      }}
    >
      <Popup>
        <h3>{startCase(campground.facility_name.toLowerCase())}</h3>
        <br />
        {campground.facility_type}
      </Popup>
    </Marker>
  )
}

export const CampgroundMap = ({
  advancedDate,
  campgrounds,
  daysOfWeek,
  endDate,
  startDate,
  onClick,
}: Props): JSX.Element | null => {
  const filteredCampgrounds: Campground[] = campgrounds.filter(
    campground => campground.facility_latitude !== undefined && campground.facility_longitude !== undefined,
  )

  if (filteredCampgrounds.length > 0) {
    return (
      <MapContainer
        {...getLeafletProps(campgroundsToLocations(campgrounds))}
        style={{ height: '40vh', borderRadius: '4px' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {filteredCampgrounds.map(campground => (
          <CampgroundMarker
            key={uniqueId()}
            campground={campground}
            startDate={startDate}
            endDate={endDate}
            advancedDate={advancedDate}
            daysOfWeek={daysOfWeek}
            onClick={onClick}
          />
        ))}
      </MapContainer>
    )
  } else {
    return null
  }
}
