import startCase from 'lodash/startCase'
import uniqueId from 'lodash/uniqueId'
import React from 'react'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'

import { Campground, campgroundsToLocations, getLeafletProps } from '../../store/campgrounds'

interface Props {
  campgrounds: Campground[]
}

export const CampgroundMap = ({ campgrounds }: Props): JSX.Element | null => {
  const filteredCampgrounds: Campground[] = campgrounds.filter(
    campground => campground.facility_latitude !== undefined && campground.facility_longitude !== undefined,
  )
  if (filteredCampgrounds.length > 0) {
    const markers = filteredCampgrounds.map(campground => {
      return (
        <Marker key={uniqueId()} position={[campground.facility_latitude, campground.facility_longitude]}>
          <Popup>
            <h3>{startCase(campground.facility_name.toLowerCase())}</h3>
            <br />
            {campground.facility_type}
          </Popup>
        </Marker>
      )
    })
    return (
      <MapContainer {...getLeafletProps(campgroundsToLocations(campgrounds))} style={{ height: '40vh' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {markers}
      </MapContainer>
    )
  } else {
    return null
  }
}
