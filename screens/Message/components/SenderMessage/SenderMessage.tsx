import React from "react";
import { Message } from "../../../../types";
import { SenderMessageBubble, SenderMessageText } from "./SenderStyles";

interface SenderMessageProps {
  message: Message;
}

const SenderMessage = ({ message }: SenderMessageProps) => {
  return (
    <SenderMessageBubble>
      <SenderMessageText>{message.message}</SenderMessageText>
    </SenderMessageBubble>
  );
};

export default SenderMessage;
