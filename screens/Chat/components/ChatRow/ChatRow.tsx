import { Text } from "react-native";
import React, { useEffect, useState } from "react";
import AuthenticationContext from "../../../../hooks/authentication/authenticationContext";
import getMatchedUserInfo from "../../../../lib/getMatchedUserInfo";
import { CLOUD_FRONT_API_ENDPOINT } from "@env";
import { useNavigation, NavigationProp } from "@react-navigation/core";
import {
  PreviewContainer,
  ProfileDisplayName,
  ProfileImage,
  ProfileItemName,
  Row,
} from "./ChatRowStyles";
import { db } from "../../../../firebase";
import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";

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
  const [lastMessage, setLastMessage] = useState(null);

  useEffect(() => {
    if (user) {
      setMatchedUserInfo(getMatchedUserInfo(matchDetails.users, user.uid));
    }
  }, [matchDetails, user]);

  useEffect(
    () =>
      onSnapshot(
        query(
          collection(db, "matches", matchDetails.id, "messages"),
          orderBy("timestamp", "desc"),
          limit(1)
        ),
        (snapshot) => setLastMessage(snapshot.docs[0]?.data()?.message)
      ),
    [matchDetails, db]
  );

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
      <PreviewContainer>
        <ProfileDisplayName numberOfLines={1} ellipsizeMode="tail">
          {matchedUserInfo?.displayName}{" "}
          <ProfileItemName>({matchedUserInfo?.itemName})</ProfileItemName>
        </ProfileDisplayName>
        <Text numberOfLines={1} ellipsizeMode="tail">
          {lastMessage || "Say Hi!"}
        </Text>
      </PreviewContainer>
    </Row>
  );
};

export default ChatRow;
