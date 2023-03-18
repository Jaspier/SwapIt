import React from "react";
import {
  AnimationContainer,
  SwappedContainer,
  SwappedText,
} from "./SwappedStyles";
import AnimatedLottieView from "lottie-react-native";
import { TouchableWithoutFeedback } from "react-native";
import AuthenticationContext from "../../hooks/authentication/authenticationContext";
import { resetProfile } from "../../api";

const SwappedScreen = ({ navigation }: any) => {
  const authContext = AuthenticationContext();
  if (!authContext) {
    return null;
  }
  const { user }: AuthContextInterface = authContext;

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        resetProfile(user);
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
