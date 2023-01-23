import { useRoute } from "@react-navigation/native";
import {
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import AnimatedLottieView from "lottie-react-native";
import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import AuthenticationContext from "../../hooks/authentication/authenticationContext";
import generateId from "../../lib/generateId";
import getMatchedUserInfo from "../../lib/getMatchedUserInfo";
import {
  CancelButton,
  CancelText,
  ConfirmedText,
  ConfirmedTextContainer,
  SwapButton,
  SwapContainer,
  SwapText,
} from "./SwapStyles";

type User = {
  id: number;
  displayName: string;
  itemName: string;
  location: string;
};

const SwapScreen = ({ navigation }: any) => {
  const authContext = AuthenticationContext();
  if (!authContext) {
    return null;
  }
  const { user }: AuthContextInterface = authContext;

  const { params } = useRoute();
  //@ts-ignore
  const { matchDetails } = params;

  let [matchedUsers, setMatchedUsers] = useState(null);
  let [matchedUser, setMatchedUser] = useState<User | null>(null);
  let [confirmed, setConfirmed] = useState(false);

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
          (snapshot) => {
            if (snapshot.exists()) {
              setMatchedUsers(snapshot.data().users);
              if (snapshot.data().users[user.uid].confirmed) {
                setConfirmed(true);
              }
              const matchedUser = getMatchedUserInfo(
                snapshot.data().users,
                user.uid
              );
              setMatchedUser(matchedUser);
              if (
                snapshot.data().users[user.uid].confirmed &&
                snapshot.data().users[matchedUser.id].confirmed
              ) {
                console.log("SWAPIT!");
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
  }, [db]);

  const ConfirmSwap = async (confirm: boolean) => {
    let matchedUser;
    if (user) {
      const docRef = doc(
        db,
        "matches",
        generateId(matchDetails.usersMatched[0], matchDetails.usersMatched[1])
      );
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        matchedUser = getMatchedUserInfo(docSnap.data().users, user?.uid);
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
      if (matchedUsers) {
        const currentUser: User = matchedUsers[user.uid];
        const updatedCurrentUser = {
          ...currentUser,
          confirmed: confirm ? true : false,
          timestamp: serverTimestamp(),
        };

        const updatedMatchedUsers = {
          [user.uid]: updatedCurrentUser,
          [matchedUser.id]: matchedUser,
        };

        const docRef = doc(
          db,
          "matches",
          generateId(matchDetails.usersMatched[0], matchDetails.usersMatched[1])
        );
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          updateDoc(docRef, {
            users: updatedMatchedUsers,
            timestamp: serverTimestamp(),
          })
            .then(() => {
              if (!confirm) {
                navigation.goBack();
              }
            })
            .catch((error) => {
              alert(error.message);
            });
        }
      }
    }
  };

  return (
    <SwapContainer>
      {user && user.uid && confirmed ? (
        <>
          <AnimatedLottieView
            key="animation"
            autoPlay
            loop={false}
            resizeMode="contain"
            source={require("../../assets/swap-confirmation.json")}
          />
          <ConfirmedTextContainer>
            <ConfirmedText>
              Waiting on {matchedUser ? matchedUser.displayName : "partner"} to
              confirm...
            </ConfirmedText>
          </ConfirmedTextContainer>
          <CancelButton onPress={() => ConfirmSwap(false)}>
            <CancelText>Cancel</CancelText>
          </CancelButton>
        </>
      ) : (
        <>
          <AnimatedLottieView
            key="animation"
            autoPlay
            loop
            resizeMode="cover"
            source={require("../../assets/ripple.json")}
          />
          <SwapButton onPress={() => ConfirmSwap(true)}>
            <SwapText>SWAP</SwapText>
          </SwapButton>
        </>
      )}
    </SwapContainer>
  );
};

export default SwapScreen;
