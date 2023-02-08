import { FlatList, View, Text } from "react-native";
import React, { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../../../firebase";
import AuthenticationContext from "../../../../hooks/authentication/authenticationContext";
import ChatRow from "../ChatRow/ChatRow";
import { NoMatchesContainer, NoMatchesText } from "./ChatListStyles";
import { Swipeable } from "react-native-gesture-handler";
import axios from "axios";

const ChatList = () => {
  const authContext = AuthenticationContext();
  const [matches, setMatches] = useState<{ id: string }[]>([]);
  if (!authContext) {
    return null;
  }
  const { user }: AuthContextInterface = authContext;

  const deleteMatch = async (usersMatched: string[]) => {
    if (user) {
      axios
        .post("/deleteMatch", usersMatched, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.stsTokenManager.accessToken}`,
          },
        })
        .catch((e) => {
          console.error(e.response.data.detail);
        });
    }
  };

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

  const RightActions = () => {
    return (
      <View
        style={{
          backgroundColor: "red",
          alignItems: "center",
          justifyContent: "center",
          alignSelf: "center",
          width: 85,
          height: 85,
        }}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>Delete</Text>
      </View>
    );
  };

  return matches.length > 0 ? (
    <FlatList
      style={{ height: "100%" }}
      data={matches}
      keyExtractor={(item) => item.id}
      renderItem={({ item }: any) => (
        <Swipeable
          friction={3}
          renderRightActions={() => <RightActions />}
          onSwipeableRightOpen={() => deleteMatch(item.usersMatched)}
        >
          <ChatRow matchDetails={item} />
        </Swipeable>
      )}
    />
  ) : (
    <NoMatchesContainer>
      <NoMatchesText>No matches at the moment 😥</NoMatchesText>
    </NoMatchesContainer>
  );
};

export default ChatList;
