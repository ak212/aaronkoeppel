import { startCase } from 'lodash'
import React from 'react'
import { Map as LeafletMap, Marker, Popup, TileLayer } from 'react-leaflet'

import { Campground, campgroundsToLocations, getLeafletProps } from '../reducers/Campsites'

interface Props {
   campgrounds: Campground[]
}

export default class CampgroundMap extends React.Component<Props> {
   public constructor(props: Props) {
      super(props)
   }

   public render = () => {
      if (this.props.campgrounds.length > 0) {
         const markers = this.props.campgrounds.map((campground) => {
            return (
               <Marker position={[campground.facility_latitude, campground.facility_longitude]}>
                  <Popup>
                     <h3>{startCase(campground.facility_name.toLowerCase())}</h3>
                     <br />
                     {campground.facility_type}
                  </Popup>
               </Marker>
            )
         })
         return (
            <LeafletMap {...getLeafletProps(campgroundsToLocations(this.props.campgrounds))} style={{ height: "40vh" }}>
               <TileLayer
                  url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                  attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
               />
               {markers}
            </LeafletMap>
         )
      } else {
         return null
      }
   }
}
