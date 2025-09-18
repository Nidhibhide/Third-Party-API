"use client";

import { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";

export default function NearbyRestaurantsCurrentLocation() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const [nearbyPlaces, setNearbyPlaces] = useState<any[]>([]);

  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
      version: "weekly",
    });

    loader.load().then(() => {
      if (mapRef.current) {
        const newMap = new google.maps.Map(mapRef.current, {
          center: { lat: 28.6139, lng: 77.209 }, // fallback
          zoom: 14,
        });
        setMap(newMap);

        // Get user's current location
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(async (position) => {
            const userLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            newMap.setCenter(userLocation);

            // Add marker for current location
            const userMarker = new google.maps.Marker({
              map: newMap,
              position: userLocation,
              title: "You are here",
            });
            setMarkers([userMarker]);

            // Fetch nearby restaurants
            const res = await fetch(
              `https://places.googleapis.com/v1/places:nearbysearch?location=${userLocation.lat},${userLocation.lng}&radius=2000&type=restaurant&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
              }
            );
            const data = await res.json();
            setNearbyPlaces(data.places || []);

            // Add markers for nearby restaurants
            const newMarkers = (data.places || []).map((place: any) => {
              if (place.location) {
                return new google.maps.Marker({
                  map: newMap,
                  position: {
                    lat: place.location.latitude,
                    lng: place.location.longitude,
                  },
                  title: place.name,
                });
              }
            });
            setMarkers((prev) => [...prev, ...newMarkers]);
          });
        }
      }
    });
  }, []);

  return (
    <div className="p-4">
      <h3 className="font-semibold mb-2">Nearby Restaurants:</h3>
      <ul className="border rounded p-2 max-h-40 overflow-y-auto mb-4">
        {nearbyPlaces.map((place: any, idx: number) => (
          <li key={idx} className="p-1 border-b last:border-b-0">
            {place.name}
          </li>
        ))}
      </ul>
      <div ref={mapRef} style={{ width: "100%", height: "500px" }} />
    </div>
  );
}
//suggesations
//1.Move all Places API requests to a backend route.
//2.Only use the public key for rendering the map, not for API requests.
// 3.Make sure google is accessed after the script is loaded.
//4.add debouncing
