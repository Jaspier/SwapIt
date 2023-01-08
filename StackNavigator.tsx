import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./screens/Home/HomeScreen";
import LoginScreen from "./screens/Auth/LoginScreen";
import RegisterScreen from "./screens/Auth/RegisterScreen";
import ChatScreen from "./screens/Chat/ChatScreen";
import AuthenticationContext from "./hooks/authentication/authenticationContext";
import SplashScreen from "./screens/Auth/SplashScreen";
import ProfileScreen from "./screens/Profile/ProfileScreen";
import MatchedScreen from "./screens/MatchedModal/MatchedScreen";

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
          <Stack.Group>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Chat" component={ChatScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
          </Stack.Group>
          <Stack.Group screenOptions={{ presentation: "transparentModal" }}>
            <Stack.Screen name="Match" component={MatchedScreen} />
          </Stack.Group>
        </>
      ) : (
        <>
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default StackNavigator;
