import { Text, Button } from "react-native";
import React from "react";
import AuthenticationContext from "../../hooks/authentication/authenticationContext";
import { SafeArea } from "../../components/utilities";

const ProfileScreen = () => {
  const authContext = AuthenticationContext();
  if (!authContext) {
    return null;
  }
  const { logout }: AuthContextInterface = authContext;

  return (
    <SafeArea>
      <Text>ProfileScreen</Text>
      <Button title="Logout" onPress={() => logout()} />
    </SafeArea>
  );
};

export default ProfileScreen;
