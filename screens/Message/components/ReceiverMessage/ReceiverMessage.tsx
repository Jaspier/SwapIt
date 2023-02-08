import React from "react";
import {
  DefaultReceiverProfileImage,
  ReceiverMessageBubble,
  ReceiverMessageText,
  ReceiverProfileImage,
} from "./ReceiverStyles";
import { CLOUD_FRONT_API_ENDPOINT } from "@env";

const ReceiverMessage = ({ message }: any) => {
  return (
    <ReceiverMessageBubble>
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
      <ReceiverMessageText>{message.message}</ReceiverMessageText>
    </ReceiverMessageBubble>
  );
};

export default ReceiverMessage;
