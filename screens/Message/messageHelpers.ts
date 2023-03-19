import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { useEffect } from "react";
import { sendMessage, sendPushNotification } from "../../api";
import { db } from "../../firebase";
import getMatchedUserInfo from "../../lib/getMatchedUserInfo";
import { Match } from "../../types";

export const useMatchedUserStatus = (
  user: any,
  matchDetails: Match,
  setStatus: React.Dispatch<React.SetStateAction<string>>
) => {
  useEffect(() => {
    if (user) {
      const matchedUserId = getMatchedUserInfo(matchDetails.users, user.uid).id;
      const unsubscribe = onSnapshot(
        doc(db, "users", matchedUserId),
        (snapshot: any) => {
          const matchedUser = snapshot.data();
          if (matchedUser) {
            setStatus(matchedUser.status);
          }
        }
      );

      return () => unsubscribe();
    }
  }, [user, matchDetails, setStatus]);
};

export const useFetchMessages = (
  matchDetails: Match,
  setMessages: React.Dispatch<React.SetStateAction<{ id: string }[]>>
) => {
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
    [matchDetails, db, setMessages]
  );
};

export const send = async (
  user: any,
  matchDetails: Match,
  input: string,
  setInput: React.Dispatch<React.SetStateAction<string>>
) => {
  if (user) {
    const sent = await sendMessage(
      user.stsTokenManager.accessToken,
      matchDetails,
      input
    );
    if (sent) {
      sendPushNotification(
        user.stsTokenManager.accessToken,
        "message",
        matchDetails,
        input
      );
    }
    setInput("");
  }
};
