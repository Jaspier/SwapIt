import { Text, Button } from "react-native";
import React from "react";
import AuthenticationContext from "../../hooks/authentication/authenticationContext";
import { SafeArea } from "../../components/utilities";

const HomeScreen = () => {
  const authContext = AuthenticationContext();
  if (!authContext) {
    return null;
  }
  const { logout } = authContext;
  return (
    <SafeArea>
      <Text>HomeScreen</Text>
      <Button title="Logout" onPress={() => logout()} />
    </SafeArea>
  );
};

export default HomeScreen;
