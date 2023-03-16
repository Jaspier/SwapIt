import {
  checkUserExists,
  getSearchPreferences,
  like,
  pass,
  sendPushNotification,
} from "../../api";
import { db } from "../../firebase";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { getDistance } from "geolib";
import { Coords, Profile, Notification } from "../../types";
import generateId from "../../lib/generateId";
import { NavigationProp } from "@react-navigation/core";

export const notificationHandler = (
  notifications: Notification[],
  isFocused: any,
  navigation: NavigationProp<any>,
  removeNotification: any,
  Toast: any
) => {
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
};

export const fetchCards = async (
  accessToken: string,
  uid: string,
  setProfiles: any
) => {
  const userExists = await checkUserExists(accessToken);
  if (!userExists) return;
  let userCoords: Coords;
  let radius: number;
  let passes;
  let swipes;
  const searchPreferences = await getSearchPreferences(accessToken);
  if (searchPreferences) {
    userCoords = searchPreferences.userCoords;
    radius = searchPreferences.radius;
    passes = searchPreferences.passes;
    swipes = searchPreferences.swipes;
  } else {
    return () => {};
  }
  const passedUserIds = passes.length > 0 ? passes : ["none"];
  const swipedUserIds = swipes.length > 0 ? swipes : ["none"];

  const unsubscribe = onSnapshot(
    query(
      collection(db, "users"),
      where("id", "not-in", [...passedUserIds, ...swipedUserIds, uid])
    ),
    (snapshot) => {
      setProfiles(
        snapshot.docs
          .filter(
            (doc) =>
              getDistance(doc.data().coords, userCoords) / 1609.34 < radius &&
              doc.data().active
          )
          .map((doc) => ({
            id: doc.id,
            displayName: doc.data().displayName,
            itemName: doc.data().itemName,
            ...doc.data(),
          }))
      );
    }
  );

  return unsubscribe;
};

export const swipeLeft = async (
  accessToken: string,
  cardIndex: number,
  profiles: Profile[]
) => {
  if (!profiles[cardIndex]) return;
  const userSwiped = profiles[cardIndex];
  pass(accessToken, userSwiped);
};

export const swipeRight = async (
  accessToken: string,
  cardIndex: number,
  profiles: Profile[],
  navigation: NavigationProp<any>
) => {
  if (!profiles[cardIndex]) return;
  const userSwiped = profiles[cardIndex];
  const response = await like(accessToken, userSwiped);
  if (response && response.status == 201) {
    const loggedInProfile = response.data;
    const matchDetails = {
      id: generateId(loggedInProfile.id, userSwiped.id),
      users: {
        [loggedInProfile.id]: {
          ...loggedInProfile,
        },
        [userSwiped.id]: {
          ...userSwiped,
        },
      },
      usersMatched: [loggedInProfile.id, userSwiped.id],
    };
    sendPushNotification(accessToken, "match", matchDetails, "");
    navigation.navigate("Match", {
      loggedInProfile,
      userSwiped,
      matchDetails,
    });
  }
};
