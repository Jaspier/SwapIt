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
        onPress={() =>
          navigation.navigate("MatchDetails", { matchedUserDetails })
        }
      >
        {message.photoUrl ? (
          <ReceiverProfileImage
            source={{
              uri: `${CLOUD_FRONT_API_ENDPOINT}/fit-in/400x400/public/profiles/${message.photoUrl}`,
            }}
          />
        ) : (
          <DefaultReceiverProfileImage
            label={message ? message.displayName.charAt(0).toUpperCase() : "S"}
          />
        )}
      </ProfileImageTouchable>
      {message.type === "photo" ? (
        <MessagePhoto
          source={{
            uri: `${CLOUD_FRONT_API_ENDPOINT}/fit-in/400x400/public/chats/${matchDetails.id}/${message.message}`,
          }}
        />
      ) : (
        <MessageText>{message.message}</MessageText>
      )}
    </MessageBubble>
  );
};

export default ReceiverMessage;
