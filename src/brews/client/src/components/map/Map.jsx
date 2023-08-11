import React from 'react'
import GoogleMapReact from 'google-map-react'
import { Icon } from '@iconify/react'
import locationIcon from '@iconify/icons-mdi/map-marker'
import BreweryMarker from './BreweryMarker'
import './map.css'

const LocationPin = ({ text }) => (
  <div className="pin">
    <Icon icon={locationIcon} className="pin-icon" />
    <p className="pin-text">{text}</p>
  </div>
)

const Map = ({ handleBrewerySelect, center, location, zoomLevel, points }) => (
  <div className="map">
    <div className="google-map">
      <GoogleMapReact
        bootstrapURLKeys={{ key: "AIzaSyCOLA2dS0_zw0XW7XBdH4V8cO4qOzeWEOc" }}
        center={center}
        zoom={zoomLevel}
      >
        <LocationPin
          lat={location.lat}
          lng={location.lng}
          text={location.address}
        />

        {points.map(({ lat, lng, id, title }) => {
          return (
            <BreweryMarker handleBrewerySelect={handleBrewerySelect} key={id} lat={lat} lng={lng} text={id} tooltip={title} />
          );
        })}

      </GoogleMapReact>
    </div>
  </div>
)

export default Map