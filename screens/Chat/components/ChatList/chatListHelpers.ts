import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect } from "react";
import { db } from "../../../../firebase";

export const fetchMatches = (
  user: any,
  setMatches: React.Dispatch<React.SetStateAction<{ id: string }[]>>
) => {
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
  }, [user, setMatches]);
};
