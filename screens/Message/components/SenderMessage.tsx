import { CLOUD_FRONT_API_ENDPOINT } from "@env";
import React from "react";
import { TouchableOpacity } from "react-native";
import { Match, Message } from "../../../types";
import { MessageBubble, MessagePhoto, MessageText } from "../MessageStyles";
import { useNavigation, NavigationProp } from "@react-navigation/core";

interface SenderMessageProps {
  message: Message;
  matchDetails: Match;
}

const SenderMessage = ({ message, matchDetails }: SenderMessageProps) => {
  const navigation: NavigationProp<any> = useNavigation();
  return (
    <MessageBubble sender type={message.type}>
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

export default SenderMessage;
