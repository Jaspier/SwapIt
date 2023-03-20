import { CLOUD_FRONT_API_ENDPOINT } from "@env";
import React from "react";
import { Match, Message } from "../../../types";
import { MessageBubble, MessagePhoto, MessageText } from "../MessageStyles";

interface SenderMessageProps {
  message: Message;
  matchDetails: Match;
}

const SenderMessage = ({ message, matchDetails }: SenderMessageProps) => {
  return (
    <MessageBubble sender type={message.type}>
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

export default SenderMessage;
