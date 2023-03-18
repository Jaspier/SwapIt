import { Text } from "react-native";
import React, { useState } from "react";
import AuthenticationContext from "../../../../hooks/authentication/authenticationContext";
import { CLOUD_FRONT_API_ENDPOINT } from "@env";
import { useNavigation, NavigationProp } from "@react-navigation/core";
import {
  PreviewContainer,
  ProfileDisplayName,
  ProfileImage,
  ProfileItemName,
  Row,
} from "./ChatRowStyles";
import { MatchedUser, Match } from "../../../../types";
import { useFetchMatchedUserInfo, useGetLastMessage } from "./chatRowHelpers";

interface ChatRowProps {
  matchDetails: Match;
}

const ChatRow = ({ matchDetails }: ChatRowProps) => {
  const navigation: NavigationProp<any> = useNavigation();
  const authContext = AuthenticationContext();
  if (!authContext) {
    return null;
  }
  const { user }: AuthContextInterface = authContext;
  const [matchedUserInfo, setMatchedUserInfo] = useState<MatchedUser | null>(
    null
  );
  const [lastMessage, setLastMessage] = useState(null);
  const [lastMessageUser, setLastMessageUser] = useState(null);

  useFetchMatchedUserInfo(matchDetails, user, setMatchedUserInfo);

  useGetLastMessage(matchDetails, setLastMessage, setLastMessageUser);

  return (
    <Row
      disabled={matchDetails.deactivated}
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
      <PreviewContainer>
        <ProfileDisplayName numberOfLines={1} ellipsizeMode="tail">
          {matchedUserInfo?.displayName}{" "}
          <ProfileItemName>({matchedUserInfo?.itemName})</ProfileItemName>
        </ProfileDisplayName>
        <Text numberOfLines={1} ellipsizeMode="tail">
          {lastMessageUser === user?.uid && "You: "}
          {lastMessage || "Say Hi!"}
        </Text>
      </PreviewContainer>
    </Row>
  );
};

export default ChatRow;
