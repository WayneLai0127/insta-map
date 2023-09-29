import { useLoadScript, GoogleMap, MarkerF } from "@react-google-maps/api";
import type { NextPage } from "next";
import { useEffect, useMemo, useState } from "react";
import { api } from "~/utils/api";

const DEFAULT_LOCATION: { lat: number; lng: number } = {
  lat: 24.1252222,
  lng: 120.682733,
};

const Markers = () => {
  const { data, isLoading: postsLoading } = api.post.getAll.useQuery();
  if (!data) return <p> Something went wrong</p>;

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

const Home: NextPage = () => {
  const libraries = useMemo(() => ["places"], []);
  const [currentLocation, setCurrentLocation] = useState(DEFAULT_LOCATION);
  useEffect(() => {
    // Use the browser's geolocation API to get the user's current location
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
    [],
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
        mapContainerStyle={{ width: "800px", height: "800px" }}
        onLoad={() => console.log("Map Component Loaded...")}
      >
        <Markers />
      </GoogleMap>
    </div>
  );
};

export default Home;
