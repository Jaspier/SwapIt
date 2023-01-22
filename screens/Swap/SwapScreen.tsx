import AnimatedLottieView from "lottie-react-native";
import React from "react";
import { SwapButton, SwapContainer, SwapText } from "./SwapStyles";

const SwapScreen = () => {
  return (
    <SwapContainer>
      <AnimatedLottieView
        key="animation"
        autoPlay
        loop
        resizeMode="cover"
        source={require("../../assets/ripple.json")}
      />
      <SwapButton>
        <SwapText>SWAP</SwapText>
      </SwapButton>
    </SwapContainer>
  );
};

export default SwapScreen;
