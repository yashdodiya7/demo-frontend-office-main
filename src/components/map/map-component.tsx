"use client"

import React, { useState, useEffect } from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';
import axios from 'axios';
import CustomMarker from './custom-marker';

interface Listing {
  id: number;
  latitude: number;
  longitude: number;
  user_name: string;
  profile_image: string;
}

interface MapComponentProps {
  id: number | undefined;
}

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL

const MapComponent: React.FC<MapComponentProps> = ({ id }) => {
  const [data, setData] = useState<{ current_post: any, nearby_posts: Listing[] } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/listing/nearbypost/${id}`);
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [id]); // Fetch data whenever the id prop changes

  const handleMarkerClick = (listingId: number) => {
    // Redirect to the listing details page when a marker is clicked
    window.location.href = `/listdetails/${listingId}`;
  };

  if (!data) {
    return (
      <div className="flex items-center justify-center h-[100%]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-stone-700"></div>
      </div>
    );
  }

  const { current_post, nearby_posts } = data;

  const mapStyles = {
    height: '400px',
    width: '100%',
  };

  const defaultCenter: any = {
    lat: current_post?.latitude,
    lng: current_post?.longitude,
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
          icon={{
            url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
          }}
        />

        {/* Markers for other listings */}
        {nearby_posts.map((listing: any) => (
          <CustomMarker
          key={listing.id}
          position={{ lat: listing.latitude, lng: listing.longitude }}
          user_name={listing.user_name}
          profile_image={listing.profile_image}
          onClick={() => handleMarkerClick(listing.id)}
        />
        ))}
      </GoogleMap>
    </div>
  );
};

export default MapComponent;
