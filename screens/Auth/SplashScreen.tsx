import React, { useEffect } from "react";
import { FullArea } from "../../components/utilities";
import {
  AuthBackground,
  SplashButton,
  SplashText,
  Title,
} from "./components/authStyles";
import * as Notifications from "expo-notifications";
import displayError from "../../lib/displayError";

const SplashScreen = ({ navigation }: any) => {
  useEffect(() => {
    registerForPushNotifications();
  }, []);

  const registerForPushNotifications = async () => {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      displayError(
        "Failed to get push token for push notification. Please try again later."
      );
      return;
    }
  };

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
