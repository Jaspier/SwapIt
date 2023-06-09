import React from "react";
import { CLOUD_FRONT_API_ENDPOINT } from "@env";
import { useNavigation, NavigationProp } from "@react-navigation/core";
import { Match, MatchedUser, Message } from "../../../types";
import {
  DefaultReceiverProfileImage,
  MessageBubble,
  MessagePhoto,
  MessageText,
  ProfileImageTouchable,
  ReceiverProfileImage,
} from "../MessageStyles";
import { TouchableOpacity } from "react-native";

interface ReceiverMessageProps {
  message: Message;
  matchedUserDetails: MatchedUser;
  matchDetails: Match;
}

const ReceiverMessage = ({
  message,
  matchedUserDetails,
  matchDetails,
}: ReceiverMessageProps) => {
  const navigation: NavigationProp<any> = useNavigation();
  return (
    <MessageBubble sender={false} type={message.type}>
      <ProfileImageTouchable
        type={message.type}
        onPress={() => {
          if (message.photoUrl !== "") {
            navigation.navigate("Inspect", {
              profilePic: {
                userId: matchedUserDetails.id,
                key: message.photoUrl,
                text: message.displayName.charAt(0).toUpperCase(),
              },
            });
          }
        }}
      >
        {message.photoUrl ? (
          <ReceiverProfileImage
            source={{
              uri: `${CLOUD_FRONT_API_ENDPOINT}/fit-in/400x400/public/profiles/${matchedUserDetails.id}/${message.photoUrl}`,
            }}
          />
        ) : (
          <DefaultReceiverProfileImage
            label={message ? message.displayName.charAt(0).toUpperCase() : "S"}
          />
        )}
      </ProfileImageTouchable>
      {message.type === "photo" ? (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("Inspect", {
              photo: { matchId: matchDetails.id, key: message.message },
            })
          }
        >
          <MessagePhoto
            source={{
              uri: `${CLOUD_FRONT_API_ENDPOINT}/fit-in/400x400/public/chats/${matchDetails.id}/${message.message}`,
            }}
          />
        </TouchableOpacity>
      ) : (
        <MessageText>{message.message}</MessageText>
      )}
    </MessageBubble>
  );
};

export default ReceiverMessage;
