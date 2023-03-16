import { checkUserExists, updateLocation } from "./api";
import * as Location from "expo-location";

export const getUserLocation = async (
  accessToken: string,
  isNewUser: boolean
) => {
  if (!isNewUser) {
    const userExists = await checkUserExists(accessToken);
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
  if (city && !isNewUser) {
    updateLocation(accessToken, city, coords);
  }
  return {
    city,
    coords,
  };
};
