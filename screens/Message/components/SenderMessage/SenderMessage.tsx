import React from "react";
import { SenderMessageBubble, SenderMessageText } from "./SenderStyles";

const SenderMessage = ({ message }: any) => {
  return (
    <SenderMessageBubble>
      <SenderMessageText>{message.message}</SenderMessageText>
    </SenderMessageBubble>
  );
};

export default SenderMessage;
