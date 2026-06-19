import { useState } from "react";

export function useGeolocation() {
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [error, setError] = useState(null);

  const getLocation = (onSuccess) => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser.");
      return;
    }

    setLoadingLocation(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLoadingLocation(false);
        onSuccess({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (err) => {
        setLoadingLocation(false);
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError(
              "Location access was denied. Please allow it in your browser settings.",
            );
            break;
          case err.POSITION_UNAVAILABLE:
            setError("Location information is unavailable.");
            break;
          case err.TIMEOUT:
            setError("The request to get location timed out.");
            break;
          default:
            setError("An unknown error occurred.");
        }
      },
      {
        enableHighAccuracy: true, // uses GPS where available, not just IP
        timeout: 10000, // fail after 10 seconds
        maximumAge: 0, // don't use a cached position
      },
    );
  };

  return { getLocation, loadingLocation, error };
}
