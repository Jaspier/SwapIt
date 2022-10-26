import React from "react";
import { FullArea } from "../../components/utilities";
import {
  AuthBackground,
  SplashButton,
  SplashText,
  Title,
} from "./components/authStyles";

const SplashScreen = ({ navigation }: any) => {
  return (
    <FullArea>
      <AuthBackground>
        <Title>SwapIt</Title>
        <SplashButton onPress={() => navigation.navigate("Login")}>
          <SplashText>Sign in & get Swapping!</SplashText>
        </SplashButton>
      </AuthBackground>
    </FullArea>
  );
};

export default SplashScreen;
