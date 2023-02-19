import React from "react";
import {
  DefaultReceiverProfileImage,
  ProfileImageTouchable,
  ReceiverMessageBubble,
  ReceiverMessageText,
  ReceiverProfileImage,
} from "./ReceiverStyles";
import { CLOUD_FRONT_API_ENDPOINT } from "@env";
import { useNavigation, NavigationProp } from "@react-navigation/core";

const ReceiverMessage = ({ message, matchedUserDetails }: any) => {
  const navigation: NavigationProp<any> = useNavigation();
  return (
    <ReceiverMessageBubble>
      <ProfileImageTouchable
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
      <ReceiverMessageText>{message.message}</ReceiverMessageText>
    </ReceiverMessageBubble>
  );
};

export default ReceiverMessage;
