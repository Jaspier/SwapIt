import { useRoute } from "@react-navigation/native";
import axios from "axios";
import { doc, onSnapshot } from "firebase/firestore";
import AnimatedLottieView from "lottie-react-native";
import React, { useEffect, useState } from "react";
import { db } from "../../firebase";
import AuthenticationContext from "../../hooks/authentication/authenticationContext";
import generateId from "../../lib/generateId";
import getMatchedUserInfo from "../../lib/getMatchedUserInfo";
import { Storage } from "aws-amplify";
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
                try {
                  await axios.post("/deleteMatch", matchDetails.usersMatched, {
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${user.stsTokenManager.accessToken}`,
                    },
                  });
                } catch (e: any) {
                  console.error(e.response.data.detail);
                }
                try {
                  await axios.post(
                    "/deactivateMatches",
                    matchDetails.users[user.uid].itemName,
                    {
                      headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user.stsTokenManager.accessToken}`,
                      },
                    }
                  );
                } catch (e: any) {
                  console.error(e.response.data.detail);
                }
                const imagesToDelete = [
                  ...snapshot.data().users[user.uid].photoUrls,
                  ...snapshot.data().users[matchedUser.id].photoUrls,
                ];
                for (const image of imagesToDelete) {
                  await Storage.remove(image.uri);
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
  }, [db]);

  const cancelSwap = async () => {
    if (user && matchedUsers) {
      axios
        .post("/cancelSwap", matchDetails.usersMatched, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.stsTokenManager.accessToken}`,
          },
        })
        .then(() => {
          navigation.goBack();
        })
        .catch((e) => {
          console.error(e.response.data.detail);
        });
    }
  };

  const confirmSwap = async () => {
    if (user && matchedUsers) {
      axios
        .post("/confirmSwap", matchDetails.usersMatched, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.stsTokenManager.accessToken}`,
          },
        })
        .catch((e) => {
          console.error(e.response.data.detail);
        });
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
          <CancelButton onPress={() => cancelSwap()}>
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
          <SwapButton onPress={() => confirmSwap()}>
            <SwapText>SWAP</SwapText>
          </SwapButton>
        </>
      )}
    </SwapContainer>
  );
};

export default SwapScreen;
