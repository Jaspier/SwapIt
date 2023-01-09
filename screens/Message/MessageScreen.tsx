import { View, Text } from "react-native";
import React from "react";
import Header from "../../components/Header/Header";
import { SafeArea } from "../../components/utilities";
import AuthenticationContext from "../../hooks/authentication/authenticationContext";
import getMatchedUserInfo from "../../lib/getMatchedUserInfo";
import { useRoute } from "@react-navigation/native";

const MessageScreen = () => {
  const authContext = AuthenticationContext();
  if (!authContext) {
    return null;
  }
  const { user }: AuthContextInterface = authContext;
  const { params } = useRoute();
  //@ts-ignore
  const { matchDetails } = params;
  return (
    <SafeArea>
      <Header
        title={getMatchedUserInfo(matchDetails.users, user?.uid).displayName}
      />
      <Text>MessageScreen</Text>
    </SafeArea>
  );
};

export default MessageScreen;
