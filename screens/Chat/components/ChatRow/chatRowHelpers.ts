import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { useEffect } from "react";
import { db } from "../../../../firebase";
import getMatchedUserInfo from "../../../../lib/getMatchedUserInfo";
import { Match, MatchedUser } from "../../../../types";

export const useFetchMatchedUserInfo = (
  matchDetails: Match,
  user: any,
  setMatchedUserInfo: React.Dispatch<React.SetStateAction<MatchedUser | null>>
) => {
  useEffect(() => {
    if (user) {
      setMatchedUserInfo(getMatchedUserInfo(matchDetails.users, user.uid));
    }
  }, [matchDetails, user, setMatchedUserInfo]);
};

export const useGetLastMessage = (
  matchDetails: Match,
  setLastMessage: React.Dispatch<React.SetStateAction<string | null>>,
  setLastMessageUser: React.Dispatch<React.SetStateAction<null>>
) => {
  useEffect(
    () =>
      onSnapshot(
        query(
          collection(db, "matches", matchDetails.id, "messages"),
          orderBy("timestamp", "desc"),
          limit(1)
        ),
        (snapshot) => {
          if (snapshot.docs[0]?.data()?.type === "photo") {
            setLastMessage("Image");
          } else {
            setLastMessage(snapshot.docs[0]?.data()?.message);
          }
          setLastMessageUser(snapshot.docs[0]?.data()?.userId);
        }
      ),
    [matchDetails, db, setLastMessage, setLastMessageUser]
  );
};
