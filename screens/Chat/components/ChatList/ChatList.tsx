import { FlatList } from "react-native";
import React, { useState } from "react";
import AuthenticationContext from "../../../../hooks/authentication/authenticationContext";
import ChatRow from "../ChatRow/ChatRow";
import {
  DeleteSlider,
  DeleteText,
  NoMatchesContainer,
  NoPartnersText,
} from "./ChatListStyles";
import { Swipeable } from "react-native-gesture-handler";
import { deleteMatch } from "../../../../api";
import { useFetchMatches } from "./chatListHelpers";

const ChatList = () => {
  const authContext = AuthenticationContext();
  const [matches, setMatches] = useState<{ id: string }[]>([]);
  if (!authContext) {
    return null;
  }
  const { user }: AuthContextInterface = authContext;

  useFetchMatches(user, setMatches);

  return matches.length > 0 ? (
    <FlatList
      style={{ height: "100%" }}
      data={matches}
      keyExtractor={(item) => item.id}
      renderItem={({ item }: any) => (
        <Swipeable
          friction={3}
          renderRightActions={() => (
            <DeleteSlider>
              <DeleteText>Delete</DeleteText>
            </DeleteSlider>
          )}
          onSwipeableRightOpen={() => deleteMatch(user, item.usersMatched)}
        >
          <ChatRow matchDetails={item} />
        </Swipeable>
      )}
    />
  ) : (
    <NoMatchesContainer>
      <NoPartnersText>No swap partners at the moment 😥</NoPartnersText>
    </NoMatchesContainer>
  );
};

export default ChatList;
