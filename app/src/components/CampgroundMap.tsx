import startCase from 'lodash/startCase'
import React from 'react'
import { Map as LeafletMap, Marker, Popup, TileLayer } from 'react-leaflet'

import { Campground, campgroundsToLocations, getLeafletProps } from '../reducers/Campsites'

interface Props {
  campgrounds: Campground[]
}

export const CampgroundMap = (props: Props): JSX.Element | null => {
  const filteredCampgrounds: Campground[] = props.campgrounds.filter(
    campground => campground.facility_latitude !== undefined && campground.facility_longitude !== undefined
  )
  if (filteredCampgrounds.length > 0) {
    const markers = filteredCampgrounds.map(campground => {
      return (
        <Marker key={campground.facility_id} position={[campground.facility_latitude, campground.facility_longitude]}>
          <Popup>
            <h3>{startCase(campground.facility_name.toLowerCase())}</h3>
            <br />
            {campground.facility_type}
          </Popup>
        </Marker>
      )
    })
    return (
      <LeafletMap {...getLeafletProps(campgroundsToLocations(props.campgrounds))} style={{ height: '40vh' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {markers}
      </LeafletMap>
    )
  } else {
    return null
  }
}
