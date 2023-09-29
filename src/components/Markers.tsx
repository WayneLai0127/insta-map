// Markers.js
import React from 'react';
import { MarkerF } from '@react-google-maps/api';
import { api } from '~/utils/api';

const Markers = () => {
  const { data, isLoading: postsLoading } = api.post.getAll.useQuery();
  if (!data) return <p>Something went wrong</p>;

  if (postsLoading) return <div />;

  return data.map((marker) => (
    <MarkerF
      key={marker.id}
      position={{ lat: Number(marker.lat), lng: Number(marker.lng) }}
      title={marker.locationName}
      // You can add more props like icon, label, onClick, etc.
    />
  ));
};

export default Markers;
