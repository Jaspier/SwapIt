import { FlatList } from "react-native";
import React, { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../../../firebase";
import AuthenticationContext from "../../../../hooks/authentication/authenticationContext";
import ChatRow from "../ChatRow/ChatRow";
import { NoMatchesContainer, NoMatchesText } from "./ChatListStyles";

const ChatList = () => {
  const authContext = AuthenticationContext();
  const [matches, setMatches] = useState<{ id: string }[]>([]);
  if (!authContext) {
    return null;
  }
  const { user }: AuthContextInterface = authContext;

  useEffect(() => {
    let unsub;
    if (user) {
      unsub = onSnapshot(
        query(
          collection(db, "matches"),
          where("usersMatched", "array-contains", user.uid)
        ),
        (snapshot) =>
          setMatches(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }))
          )
      );
    }
    return unsub;
  }, [user]);

  return matches.length > 0 ? (
    <FlatList
      style={{ height: "100%" }}
      data={matches}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <ChatRow matchDetails={item} />}
    />
  ) : (
    <NoMatchesContainer>
      <NoMatchesText>No matches at the moment 😥</NoMatchesText>
    </NoMatchesContainer>
  );
};

export default ChatList;
