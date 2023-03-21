import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import moment from "moment";
import { useEffect } from "react";
import { sendMessage, sendPushNotification } from "../../api";
import { db } from "../../firebase";
import { getDuration } from "../../lib/getDuration";
import getMatchedUserInfo from "../../lib/getMatchedUserInfo";
import { Match } from "../../types";
import { Storage } from "aws-amplify";
import displayError from "../../lib/displayError";
import { v4 as uuidv4 } from "uuid";

export const useMatchedUserStatus = (
  user: any,
  matchDetails: Match,
  setStatus: React.Dispatch<React.SetStateAction<string>>,
  setLastOnline: React.Dispatch<React.SetStateAction<string>>
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
          if (matchedUser.status === "offline") {
            const timestamp = matchedUser.lastOnline;
            const momentObj = moment(timestamp.toDate());
            const formattedTime = getDuration(momentObj.valueOf());
            setLastOnline(formattedTime);
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

export const useFormatPhotoTaken = (
  photo: any,
  setPhotoDetails: React.Dispatch<
    React.SetStateAction<{ key: string; blob: Blob } | null>
  >
) => {
  useEffect(() => {
    const formatPhoto = async () => {
      if (photo) {
        const imageUrl = photo.uri;
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const urlParts = imageUrl.split(".");
        const extension = urlParts[urlParts.length - 1];
        const key = `${uuidv4()}.${extension}`;
        setPhotoDetails({ key, blob });
      }
    };
    formatPhoto();
  }, [photo, setPhotoDetails]);
};

export const send = async (
  user: any,
  matchDetails: Match,
  input: string,
  setInput: React.Dispatch<React.SetStateAction<string>>,
  photoDetails: any,
  setPhotoDetails: React.Dispatch<
    React.SetStateAction<{ key: string; blob: Blob } | null>
  >,
  params: any,
  setIsSending: React.Dispatch<React.SetStateAction<boolean>>
) => {
  if (user) {
    let type = "message";
    if (photoDetails) {
      input = photoDetails.key;
      type = "photo";
      setIsSending(true);
      try {
        await Storage.put(
          `chats/${matchDetails.id}/${photoDetails.key}`,
          photoDetails.blob
        );
      } catch (e: any) {
        setIsSending(false);
        displayError(e.message);
        return;
      }
    }
    const sent = await sendMessage(
      user.stsTokenManager.accessToken,
      matchDetails.id,
      input,
      type
    );
    if (sent) {
      setInput("");
      setPhotoDetails(null);
      setIsSending(false);
      params.photo = null;
      if (photoDetails) {
        input = "Image";
      }
      sendPushNotification(
        user.stsTokenManager.accessToken,
        "message",
        matchDetails,
        input
      );
    }
  }
};
