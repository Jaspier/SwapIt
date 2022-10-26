import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./screens/Home/HomeScreen";
import LoginScreen from "./screens/Auth/LoginScreen";
import ChatScreen from "./screens/Chat/ChatScreen";
import AuthenticationContext from "./hooks/authentication/authenticationContext";
import SplashScreen from "./screens/Auth/SplashScreen";

const Stack = createNativeStackNavigator();

const StackNavigator = () => {
  const authContext = AuthenticationContext();
  if (!authContext) {
    return null;
  }
  const { user } = authContext;
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Chat" component={ChatScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default StackNavigator;
