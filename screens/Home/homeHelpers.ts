import {
  checkUserExists,
  getSearchPreferences,
  like,
  pass,
  sendPushNotification,
} from "../../api";
import { db } from "../../firebase";
import { collection, doc, onSnapshot, query, where } from "firebase/firestore";
import { getDistance } from "geolib";
import { Coords, Profile } from "../../types";
import generateId from "../../lib/generateId";
import { NavigationProp } from "@react-navigation/core";
import { useEffect, useLayoutEffect } from "react";

export const useCheckProfileCompletion = (
  user: any | null,
  navigation: NavigationProp<any>
) => {
  useLayoutEffect(() => {
    if (user) {
      onSnapshot(doc(db, "users", user.uid), (snapshot) => {
        if (
          !snapshot.exists() ||
          (snapshot.exists() && !snapshot.data().active)
        ) {
          navigation.navigate("Profile", { newUser: true });
        }
      });
    }
  }, [db, user, navigation]);
};

export const useFetchCards = (
  user: any | null,
  params: any,
  setProfiles: React.Dispatch<React.SetStateAction<Profile[]>>
): void => {
  useEffect(() => {
    const fetchCards = async () => {
      if (!user) return;

      const accessToken = user.stsTokenManager.accessToken;
      const uid = user.uid;

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
                  getDistance(doc.data().coords, userCoords) / 1609.34 <
                    radius && doc.data().active
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

    fetchCards();
  }, [db, user, params, setProfiles]);
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
