import { View, Text, Button } from "react-native";
import React from "react";
import AuthenticationContext from "../../hooks/authentication/authenticationContext";

const HomeScreen = () => {
  const authContext = AuthenticationContext();
  if (!authContext) {
    return null;
  }
  const { logout } = authContext;
  return (
    <View>
      <Text>HomeScreen</Text>
      <Button title="Logout" onPress={() => logout()} />
    </View>
  );
};

export default HomeScreen;
