// Map.js
import React, { useEffect, useMemo, useState } from 'react';
import { useLoadScript, GoogleMap } from '@react-google-maps/api';
import Markers from './Markers'; // Import the Markers component

const DEFAULT_LOCATION = {
  lat: 24.1252222,
  lng: 120.682733,
};

const Map = () => {
  const libraries = useMemo(() => ['places'], []);
  const [currentLocation, setCurrentLocation] = useState(DEFAULT_LOCATION);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation({ lat: latitude, lng: longitude });
      },
      (error) => {
        console.error('Error getting current location:', error);
      },
    );
  }, []);

  const mapOptions = useMemo<google.maps.MapOptions>(
    () => ({
      center: currentLocation,
      disableDefaultUI: true,
      clickableIcons: true,
      scrollwheel: true,
    }),
    [currentLocation],
  );

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    libraries: libraries as any,
  });

  if (!isLoaded) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <GoogleMap
        options={mapOptions}
        zoom={10}
        mapTypeId={google.maps.MapTypeId.ROADMAP}
        mapContainerStyle={{ width: '800px', height: '800px' }}
        onLoad={() => console.log('Map Component Loaded...')}
      >
        <Markers />
      </GoogleMap>
    </div>
  );
};

export default Map;
