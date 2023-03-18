import { Platform, TouchableWithoutFeedback, Keyboard } from "react-native";
import React, { useState } from "react";
import Header from "../../components/Header/Header";
import { SafeArea } from "../../components/utilities";
import AuthenticationContext from "../../hooks/authentication/authenticationContext";
import getMatchedUserInfo from "../../lib/getMatchedUserInfo";
import { useRoute } from "@react-navigation/native";
import {
  MessageInput,
  MessageInputContainer,
  Messages,
  MessagesView,
  SendButton,
} from "./MessageStyles";
import SenderMessage from "./components/SenderMessage/SenderMessage";
import ReceiverMessage from "./components/ReceiverMessage/ReceiverMessage";
import { send, useFetchMessages } from "./messageHelpers";

interface Message {
  id: string;
}

const MessageScreen = () => {
  const authContext = AuthenticationContext();
  if (!authContext) {
    return null;
  }
  const { user }: AuthContextInterface = authContext;
  const { params } = useRoute();
  //@ts-ignore
  const { matchDetails } = params;

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  useFetchMessages(matchDetails, setMessages);

  return (
    <SafeArea>
      <Header
        title={getMatchedUserInfo(matchDetails.users, user?.uid).displayName}
        subheading={getMatchedUserInfo(matchDetails.users, user?.uid).itemName}
        nfc
        matchDetails={matchDetails}
      />
      <MessagesView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={10}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <Messages
            data={messages}
            inverted={true}
            keyExtractor={(item: any) => item.id}
            renderItem={({ item: message }: any) =>
              message.userId === user?.uid ? (
                <SenderMessage key={message.id} message={message} />
              ) : (
                <ReceiverMessage
                  key={message.id}
                  message={message}
                  matchedUserDetails={getMatchedUserInfo(
                    matchDetails.users,
                    user?.uid
                  )}
                />
              )
            }
          />
        </TouchableWithoutFeedback>
        <MessageInputContainer>
          <MessageInput
            placeholder="Send Message..."
            onChangeText={setInput}
            onSubmitEditing={() => send(user, matchDetails, input, setInput)}
            value={input}
          />
          <SendButton
            onPress={() => send(user, matchDetails, input, setInput)}
            title="Send"
          />
        </MessageInputContainer>
      </MessagesView>
    </SafeArea>
  );
};

export default MessageScreen;
