import React from "react";
import {
  ReceiverMessageBubble,
  ReceiverMessageText,
  ReceiverProfileImage,
} from "./ReceiverStyles";
import { CLOUD_FRONT_API_ENDPOINT } from "@env";

const ReceiverMessage = ({ message }: any) => {
  return (
    <ReceiverMessageBubble>
      <ReceiverProfileImage
        source={{
          uri: `${CLOUD_FRONT_API_ENDPOINT}/fit-in/400x400/public/${message.photoUrl.uri}`,
        }}
      />
      <ReceiverMessageText>{message.message}</ReceiverMessageText>
    </ReceiverMessageBubble>
  );
};

export default ReceiverMessage;
