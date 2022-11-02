import { Text, Button, View, TouchableOpacity } from "react-native";
import React from "react";
import AuthenticationContext from "../../hooks/authentication/authenticationContext";
import { SafeArea } from "../../components/utilities";
import { AvatarPressable } from "./homeStyles";

const HomeScreen = () => {
  const authContext = AuthenticationContext();
  if (!authContext) {
    return null;
  }
  const { user, logout }: AuthContextInterface = authContext;
  return (
    <SafeArea>
      {/* Start of Header */}
      <View>
        <TouchableOpacity>
          <AvatarPressable
            size={48}
            label={user ? user.email.charAt(0).toUpperCase() : "NULL"}
          />
        </TouchableOpacity>
      </View>
      {/* End of Header */}
      <Text>HomeScreen</Text>
      <Button title="Logout" onPress={() => logout()} />
    </SafeArea>
  );
};

export default HomeScreen;
