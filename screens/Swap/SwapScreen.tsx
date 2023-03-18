import { useRoute } from "@react-navigation/native";
import AnimatedLottieView from "lottie-react-native";
import React, { useState } from "react";
import AuthenticationContext from "../../hooks/authentication/authenticationContext";
import {
  CancelButton,
  CancelText,
  ConfirmedText,
  ConfirmedTextContainer,
  DisclaimerTextContainer,
  DisclaimerText,
  SwapButton,
  SwapContainer,
  SwapText,
} from "./SwapStyles";
import { User } from "../../types";
import { cancel, confirm, useCheckSwapConfirmation } from "./swapHelpers";

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

  useCheckSwapConfirmation(
    user,
    matchDetails,
    setMatchedUsers,
    setConfirmed,
    setMatchedUser,
    navigation
  );

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
          <CancelButton
            onPress={() => cancel(user, matchedUsers, matchDetails, navigation)}
          >
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
          <DisclaimerTextContainer>
            <DisclaimerText>
              DISCLAIMER: After completing this swap all other swap partners
              will be notified and deleted.
            </DisclaimerText>
          </DisclaimerTextContainer>
          <SwapButton onPress={() => confirm(user, matchedUsers, matchDetails)}>
            <SwapText>SWAP</SwapText>
          </SwapButton>
        </>
      )}
    </SwapContainer>
  );
};

export default SwapScreen;
