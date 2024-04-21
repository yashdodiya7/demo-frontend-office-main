"use client"

import React from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';

const MapComponent = () => {

  const currentPost = {
    latitude: 21.1593189,
    longitude: 72.77122,
  }

  const listings = [
    {
      id: 41,
      latitude: 21.1593189,
      longitude: 72.77122,
    },
    {
      id: 42,
      latitude: 21.2408267,
      longitude: 72.8806069,
    },
    {
      id: 43,
      latitude: 21.2266205,
      longitude: 72.8312383,
    },
  ];

  const mapStyles = {
    height: '400px',
    width: '100%',
  };

  const defaultCenter = {
    lat: currentPost.latitude,
    lng: currentPost.longitude,
  };

  return (
    <div className="relative">
      <GoogleMap
        mapContainerStyle={mapStyles}
        zoom={12}
        center={defaultCenter}
      >
        {/* Marker for the current post */}
        <Marker
          position={defaultCenter}
          // label="Current Post"
          // icon={{
          //   url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
          // }}
        />

        {/* Markers for other listings */}
        {listings.map((listing) => (
          <Marker
            key={listing.id}
            position={{ lat: listing.latitude, lng: listing.longitude }}
            // label={listing.id.toString()} // Change to any label you want to display
          />
        ))}
      </GoogleMap>
    </div>
  );
};

export default MapComponent;
