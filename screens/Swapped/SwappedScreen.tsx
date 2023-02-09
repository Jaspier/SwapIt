import React from "react";
import {
  AnimationContainer,
  SwappedContainer,
  SwappedText,
} from "./SwappedStyles";
import AnimatedLottieView from "lottie-react-native";
import { TouchableWithoutFeedback } from "react-native";
import AuthenticationContext from "../../hooks/authentication/authenticationContext";
import axios from "axios";

const SwappedScreen = ({ navigation }: any) => {
  const authContext = AuthenticationContext();
  if (!authContext) {
    return null;
  }
  const { user }: AuthContextInterface = authContext;

  const resetProfile = async () => {
    if (user) {
      axios
        .get("/resetProfile", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.stsTokenManager.accessToken}`,
          },
        })
        .catch((error) => {
          alert(error.message);
        });
    }
  };

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        resetProfile();
        navigation.navigate("Profile", { newUser: true });
      }}
    >
      <SwappedContainer>
        <>
          <AnimatedLottieView
            key="animation"
            autoPlay
            loop={false}
            resizeMode="cover"
            source={require("../../assets/confetti.json")}
          />
          <SwappedText>Swapped It!</SwappedText>
          <AnimationContainer>
            <AnimatedLottieView
              key="animation"
              autoPlay
              loop={false}
              resizeMode="contain"
              source={require("../../assets/swapped.json")}
            />
          </AnimationContainer>
        </>
      </SwappedContainer>
    </TouchableWithoutFeedback>
  );
};

export default SwappedScreen;
