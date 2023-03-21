import {
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  View,
} from "react-native";
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
  CameraButton,
  PhotoPreview,
  LoadingCircle,
  PhotoPreviewContainer,
} from "./MessageStyles";
import SenderMessage from "./components/SenderMessage";
import ReceiverMessage from "./components/ReceiverMessage";
import {
  send,
  useFetchMessages,
  useFormatPhotoTaken,
  useMatchedUserStatus,
} from "./messageHelpers";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../theme/colors";

interface Message {
  id: string;
}

const MessageScreen = ({ navigation }: any) => {
  const authContext = AuthenticationContext();
  if (!authContext) {
    return null;
  }
  const { user }: AuthContextInterface = authContext;
  const { params } = useRoute();
  //@ts-ignore
  const { photo, matchDetails } = params;

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [status, setStatus] = useState("offline");
  const [lastOnline, setLastOnline] = useState("");
  const [photoDetails, setPhotoDetails] = useState<{
    key: string;
    blob: Blob;
  } | null>(null);
  const [isSending, setIsSending] = useState(false);

  useMatchedUserStatus(user, matchDetails, setStatus, setLastOnline);

  useFetchMessages(matchDetails, setMessages);

  useFormatPhotoTaken(photo, setPhotoDetails);

  return (
    <SafeArea>
      <Header
        title={getMatchedUserInfo(matchDetails.users, user?.uid).displayName}
        subheading={getMatchedUserInfo(matchDetails.users, user?.uid).itemName}
        nfc
        status={status}
        lastOnline={lastOnline}
        matchDetails={matchDetails}
        matchedUserDetails={getMatchedUserInfo(matchDetails.users, user?.uid)}
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
                <SenderMessage
                  key={message.id}
                  message={message}
                  matchDetails={matchDetails}
                />
              ) : (
                <ReceiverMessage
                  key={message.id}
                  message={message}
                  matchedUserDetails={getMatchedUserInfo(
                    matchDetails.users,
                    user?.uid
                  )}
                  matchDetails={matchDetails}
                />
              )
            }
          />
        </TouchableWithoutFeedback>
        {photo && (
          <PhotoPreviewContainer>
            {isSending && (
              <LoadingCircle animating={true} color={colors.brand.primary} />
            )}
            <PhotoPreview
              source={{
                uri: photo.uri,
              }}
            />
          </PhotoPreviewContainer>
        )}
        <MessageInputContainer>
          <CameraButton
            onPress={() =>
              navigation.navigate("Camera", { screen: "message", matchDetails })
            }
          >
            <Ionicons name="camera" size={24} color="grey" />
          </CameraButton>
          <MessageInput
            placeholder="Send Message..."
            onChangeText={setInput}
            onSubmitEditing={() =>
              send(
                user,
                matchDetails,
                input,
                setInput,
                photoDetails,
                setPhotoDetails,
                params,
                setIsSending
              )
            }
            value={input}
          />
          <SendButton
            onPress={() =>
              send(
                user,
                matchDetails,
                input,
                setInput,
                photoDetails,
                setPhotoDetails,
                params,
                setIsSending
              )
            }
            title="Send"
          />
        </MessageInputContainer>
      </MessagesView>
    </SafeArea>
  );
};

export default MessageScreen;
