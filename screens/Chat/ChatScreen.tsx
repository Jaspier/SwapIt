import React from "react";
import { SafeArea } from "../../components/utilities";
import Header from "../../components/Header/Header";
import ChatList from "./components/ChatList/ChatList";

const ChatScreen = () => {
  return (
    <SafeArea>
      <Header title="Chat" />
      <ChatList />
    </SafeArea>
  );
};

export default ChatScreen;
