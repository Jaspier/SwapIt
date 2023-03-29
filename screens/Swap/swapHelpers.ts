import { Match, User } from "../../types";
import { NavigationProp } from "@react-navigation/core";
import { useEffect } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";
import generateId from "../../lib/generateId";
import getMatchedUserInfo from "../../lib/getMatchedUserInfo";
import {
  cancelSwap,
  confirmSwap,
  deleteMatches,
  sendManyPushNotifications,
} from "../../api";

export const useCheckSwapConfirmation = (
  user: any,
  matchDetails: Match,
  setMatchedUsers: React.Dispatch<React.SetStateAction<null>>,
  setConfirmed: React.Dispatch<React.SetStateAction<boolean>>,
  setMatchedUser: React.Dispatch<React.SetStateAction<User | null>>,
  navigation: NavigationProp<any>
) => {
  useEffect(() => {
    let unsub;

    const checkSwapConfirmation = async () => {
      if (user) {
        unsub = onSnapshot(
          doc(
            db,
            "matches",
            generateId(
              matchDetails.usersMatched[0],
              matchDetails.usersMatched[1]
            )
          ),
          async (snapshot) => {
            if (snapshot.exists()) {
              setMatchedUsers(snapshot.data().users);
              if (snapshot.data().users[user.uid].isConfirmed) {
                setConfirmed(true);
              }
              const matchedUser = getMatchedUserInfo(
                snapshot.data().users,
                user.uid
              );
              setMatchedUser(matchedUser);
              if (
                snapshot.data().users[user.uid].isConfirmed &&
                snapshot.data().users[matchedUser.id].isConfirmed
              ) {
                navigation.goBack();
                navigation.navigate("Swapped");
                const notificationsObject = await deleteMatches(
                  user.stsTokenManager.accessToken,
                  snapshot.data().users[user.uid].itemName,
                  matchedUser.id
                );
                if (notificationsObject != undefined) {
                  sendManyPushNotifications(
                    user.stsTokenManager.accessToken,
                    notificationsObject
                  );
                }
              }
            } else {
              console.log("No such document!");
            }
          }
        );
      }
    };
    checkSwapConfirmation();
    return unsub;
  }, [
    user,
    matchDetails,
    db,
    setMatchedUsers,
    setConfirmed,
    setMatchedUser,
    navigation,
  ]);
};

export const cancel = async (
  user: any,
  matchedUsers: string[] | null,
  matchDetails: Match,
  navigation: NavigationProp<any>
) => {
  if (user && matchedUsers) {
    const canceled = await cancelSwap(
      user.stsTokenManager.accessToken,
      matchDetails
    );
    if (canceled) {
      navigation.goBack();
    }
  }
};

export const confirm = async (
  user: any,
  matchedUsers: string[] | null,
  matchDetails: Match
) => {
  if (user && matchedUsers) {
    confirmSwap(user.stsTokenManager.accessToken, matchDetails);
  }
};
