import { checkUserExists, updateLocation, updateUserStatus } from "./api";
import * as Location from "expo-location";
import { Coords, Notification } from "./types";
import { useEffect, useRef } from "react";
import { NavigationProp } from "@react-navigation/core";
import { AppState, AppStateStatus } from "react-native";

export const useGetUserLocation = (
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

export const useNotificationHandler = (
  notifications: Notification[],
  navigation: NavigationProp<any>,
  removeNotification: any,
  Toast: any,
  isFocused?: any
) => {
  useEffect(() => {
    if (notifications.length > 0) {
      const currentNotification = notifications[0];
      if (currentNotification.type === "match") {
        const loggedInProfile = currentNotification.data.match.loggedInProfile;
        const userSwiped = currentNotification.data.match.userSwiped;
        if (isFocused) {
          navigation.navigate("Match", {
            loggedInProfile,
            userSwiped,
            matchDetails: currentNotification.data.matchDetails,
          });
        } else {
          Toast.show({
            type: "success",
            text1: `New Swap Partner! (${loggedInProfile.itemName})`,
            text2: `${loggedInProfile.displayName} wants to swap with you.`,
            onHide: () => {
              removeNotification(currentNotification);
            },
            onPress: () => {
              Toast.hide();
              navigation.navigate("Message", {
                matchDetails: currentNotification.data.matchDetails,
              });
            },
          });
        }
      } else if (currentNotification.type === "message") {
        Toast.show({
          type: "success",
          text1: `${currentNotification.data.message.sender.displayName} (${currentNotification.data.message.sender.itemName})`,
          text2: currentNotification.data.message.message,
          onHide: () => {
            removeNotification(currentNotification);
          },
          onPress: () => {
            Toast.hide();
            navigation.navigate("Message", {
              matchDetails: currentNotification.data.matchDetails,
            });
          },
        });
      } else {
        Toast.show({
          type: "success",
          text1: currentNotification.data.title,
          text2: currentNotification.data.text,
          onHide: () => {
            removeNotification(currentNotification);
          },
        });
      }
    }
  }, [notifications, isFocused, removeNotification, Toast, navigation]);
};

export const useUserStatus = (user: any) => {
  const prevAppStateRef = useRef<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    if (user) {
      const accessToken = user.stsTokenManager.accessToken;
      const handleAppStateChange = (nextAppState: AppStateStatus) => {
        if (
          prevAppStateRef.current !== "background" &&
          nextAppState === "background"
        ) {
          updateUserStatus(accessToken, "offline");
        } else if (
          prevAppStateRef.current !== "active" &&
          nextAppState === "active"
        ) {
          updateUserStatus(accessToken, "online");
        }
        prevAppStateRef.current = nextAppState;
      };
      updateUserStatus(accessToken, "online");
      const subscription = AppState.addEventListener(
        "change",
        handleAppStateChange
      );
      return () => {
        subscription.remove();
        if (prevAppStateRef.current !== "background") {
          updateUserStatus(accessToken, "offline");
        }
      };
    }
  }, [user, AppState]);
};
