import { checkUserExists, updateLocation } from "./api";
import * as Location from "expo-location";
import { Coords } from "./types";
import { useEffect } from "react";

export const getUserLocation = (
  user: any,
  isNewUser: boolean | null | undefined,
  shouldUpdateState: boolean,
  setLocation?: React.Dispatch<React.SetStateAction<string | null>>,
  setCoords?: React.Dispatch<React.SetStateAction<Coords>>
) => {
  useEffect(() => {
    const getLocation = async () => {
      if (!isNewUser) {
        const userExists = await checkUserExists(
          user.stsTokenManager.accessToken
        );
        if (!userExists) return;
      }
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Please grant location permissions");
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      const coords = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      };
      const reverseGeocode = await Location.reverseGeocodeAsync(coords);
      const city = reverseGeocode[0].city;
      if (city && shouldUpdateState && setLocation && setCoords) {
        setLocation(city);
        setCoords(coords);
      }
      if (city && !isNewUser) {
        updateLocation(user.stsTokenManager.accessToken, city, coords);
      }
    };
    getLocation();
  }, [user, isNewUser, setLocation, setCoords]);
};
