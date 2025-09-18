"use client";

import { useEffect, useRef, useState } from "react";
import { Loader } from "@googlemaps/js-api-loader";

export default function MapWithAutocompleteNew() {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
      version: "weekly",
    });

    loader.load().then(() => {
      if (mapRef.current) {
        const newMap = new google.maps.Map(mapRef.current, {
          center: { lat: 28.6139, lng: 77.209 }, // New Delhi
          zoom: 12,
        });
        const newMarker = new google.maps.Marker({ map: newMap });
        setMap(newMap);
        setMarker(newMarker);
      }
    });
  }, []);

  // Call Places API (New)
  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length > 2) {
      const res = await fetch(
        `https://places.googleapis.com/v1/places:autocomplete?input=${encodeURIComponent(
          value
        )}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Goog-FieldMask": "suggestions.placePrediction",
          },
        }
      );
      const data = await res.json();
      setResults(data.suggestions || []);
    } else {
      setResults([]);
    }
  };

  // When user selects a place
  const handleSelect = async (prediction: any) => {
    setQuery(prediction.placePrediction.text.text);
    setResults([]);

    const res = await fetch(
      `https://places.googleapis.com/v1/places/${prediction.placePrediction.placeId}?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&fields=location`
    );
    const data = await res.json();

    if (data.location && map && marker) {
      const location = {
        lat: data.location.latitude,
        lng: data.location.longitude,
      };
      map.setCenter(location);
      map.setZoom(14);
      marker.setPosition(location);
    }
  };

  return (
    <div className="p-4">
      <input
        value={query}
        onChange={handleChange}
        type="text"
        placeholder="Search a location..."
        className="p-2 border rounded w-full mb-2"
      />
      {results.length > 0 && (
        <ul className="border rounded bg-white mb-4 max-h-40 overflow-y-auto">
          {results.map((r, i) => (
            <li
              key={i}
              onClick={() => handleSelect(r)}
              className="p-2 hover:bg-gray-100 cursor-pointer"
            >
              {r.placePrediction.text.text}
            </li>
          ))}
        </ul>
      )}
      <div ref={mapRef} style={{ width: "100%", height: "500px" }} />
    </div>
  );
}

//suggesations
//1.add debouncing
//2.error handling
