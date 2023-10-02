// Map.js
import React, { useEffect, useMemo, useState } from "react";
import { useLoadScript, GoogleMap, MarkerF } from "@react-google-maps/api";
import MarkerCard from "./MarkerCard"; // Import the MarkerCard component
import { RouterOutputs } from "~/utils/api";

type posts = RouterOutputs["post"]["getAll"];
type post = posts[number];

const DEFAULT_LOCATION = {
  lat: 24.1252222,
  lng: 120.682733,
};

const Map = ({ posts }: { posts: posts }) => {
  const libraries = useMemo(() => ["places"], []);
  const [currentLocation, setCurrentLocation] = useState(DEFAULT_LOCATION);
  const [selectedMarker, setSelectedMarker] = useState<post | null>(null); // Track selected marker

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation({ lat: latitude, lng: longitude });
      },
      (error) => {
        console.error("Error getting current location:", error);
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

  const handleMarkerClick = (post: post) => {
    setSelectedMarker(post);
    setCurrentLocation({ lat: Number(post.lat), lng: Number(post.lng) });
  };

  const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!GOOGLE_MAPS_API_KEY) return <p>Maps service is currently invalid</p>;
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
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
        mapContainerStyle={{ width: "800px", height: "800px" }}
        onLoad={() => console.log("Map Component Loaded...")}
        onClick={() => setSelectedMarker(null)}
      >
        {posts.map((post) => (
          <MarkerF
            key={post.id}
            position={{ lat: Number(post.lat), lng: Number(post.lng) }}
            title={post.locationName}
            onClick={() => handleMarkerClick(post)} // Handle marker click
          />
        ))}
        {selectedMarker && <MarkerCard post={selectedMarker} />}
      </GoogleMap>
    </div>
  );
};

export default Map;
