import { Platform, TouchableWithoutFeedback, Keyboard } from "react-native";
import React, { useEffect, useState } from "react";
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
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../../firebase";
import axios from "axios";

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

  useEffect(
    () =>
      onSnapshot(
        query(
          collection(db, "matches", matchDetails.id, "messages"),
          orderBy("timestamp", "desc")
        ),
        (snapshot) =>
          setMessages(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }))
          )
      ),
    [matchDetails, db]
  );

  const sendMessage = () => {
    if (user) {
      axios
        .post(
          "/sendMessage",
          {
            matchId: matchDetails.id,
            message: input,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user.stsTokenManager.accessToken}`,
            },
          }
        )
        .catch((e) => {
          console.error(e.response.data.detail);
        });

      setInput("");
    }
  };

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
            onSubmitEditing={sendMessage}
            value={input}
          />
          <SendButton onPress={sendMessage} title="Send" />
        </MessageInputContainer>
      </MessagesView>
    </SafeArea>
  );
};

export default MessageScreen;
