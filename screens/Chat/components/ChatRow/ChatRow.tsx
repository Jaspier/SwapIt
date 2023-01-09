import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { useEffect, useState } from "react";
import AuthenticationContext from "../../../../hooks/authentication/authenticationContext";
import getMatchedUserInfo from "../../../../lib/getMatchedUserInfo";
import { CLOUD_FRONT_API_ENDPOINT } from "@env";
import { useNavigation, NavigationProp } from "@react-navigation/core";
import {
  ProfileDisplayName,
  ProfileImage,
  ProfileItemName,
  Row,
} from "./ChatRowStyles";

interface MatchedUserInfo {
  photoUrls: string;
  displayName: string;
  itemName: string;
}

const ChatRow = ({ matchDetails }: any) => {
  const navigation: NavigationProp<any> = useNavigation();
  const authContext = AuthenticationContext();
  if (!authContext) {
    return null;
  }
  const { user }: AuthContextInterface = authContext;
  const [matchedUserInfo, setMatchedUserInfo] =
    useState<MatchedUserInfo | null>(null);

  useEffect(() => {
    if (user) {
      setMatchedUserInfo(getMatchedUserInfo(matchDetails.users, user.uid));
    }
  }, [matchDetails, user]);

  return (
    <Row
      onPress={() =>
        navigation.navigate("Message", {
          matchDetails,
        })
      }
    >
      <ProfileImage
        source={{
          uri: matchedUserInfo
            ? `${CLOUD_FRONT_API_ENDPOINT}/fit-in/400x400/public/${
                JSON.parse(matchedUserInfo?.photoUrls)[0].uri
              }`
            : "NULL",
        }}
      />
      <View>
        <ProfileDisplayName>
          {matchedUserInfo?.displayName}{" "}
          <ProfileItemName>({matchedUserInfo?.itemName})</ProfileItemName>
        </ProfileDisplayName>
        <Text>Say Hi!</Text>
      </View>
    </Row>
  );
};

export default ChatRow;
