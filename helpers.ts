import { checkUserExists, updateLocation } from "./api";
import * as Location from "expo-location";
import { Coords, Notification } from "./types";
import { useEffect, useRef } from "react";
import { NavigationProp } from "@react-navigation/core";
import { AppState, AppStateStatus } from "react-native";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

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
      if (isFocused && currentNotification.type === "match") {
        const loggedInProfile = currentNotification.data.match.loggedInProfile;
        const userSwiped = currentNotification.data.match.userSwiped;
        navigation.navigate("Match", {
          loggedInProfile,
          userSwiped,
          matchDetails: currentNotification.data.matchDetails,
        });
      } else if (!isFocused && currentNotification.type === "match") {
        Toast.show({
          type: "success",
          text1: `You got a new match! (${currentNotification.data.match.userSwiped.itemName})`,
          text2: `${currentNotification.data.match.userSwiped.displayName} wants to swap with you.`,
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

const updateUserStatus = (userId: string, status: string) => {
  const userRef = doc(db, "users", userId);
  try {
    updateDoc(userRef, {
      status: status,
    });
  } catch (e: any) {
    console.log(e);
  }
};

export const useUserStatus = (user: any) => {
  const prevAppStateRef = useRef<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    if (user) {
      const handleAppStateChange = (nextAppState: AppStateStatus) => {
        if (
          prevAppStateRef.current !== "background" &&
          nextAppState === "background"
        ) {
          updateUserStatus(user.uid, "offline");
        } else if (
          prevAppStateRef.current !== "active" &&
          nextAppState === "active"
        ) {
          updateUserStatus(user.uid, "online");
        }
        prevAppStateRef.current = nextAppState;
      };
      updateUserStatus(user.uid, "online");
      const subscription = AppState.addEventListener(
        "change",
        handleAppStateChange
      );
      return () => {
        subscription.remove();
        if (prevAppStateRef.current !== "background") {
          updateUserStatus(user.uid, "offline");
        }
      };
    }
  }, [user, AppState]);
};
