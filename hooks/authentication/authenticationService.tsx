import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import * as Notifications from "expo-notifications";
import axios from "axios";

export const loginRequest = (email: string, password: string) => {
  return new Promise((resolve, reject) => {
    signInWithEmailAndPassword(auth, email, password)
      .then((res: any) => {
        Notifications.getExpoPushTokenAsync()
          .then((response) => {
            const deviceToken = response.data;
            const accessToken = res.user.stsTokenManager.accessToken;
            axios
              .post("/storeDeviceToken", deviceToken, {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${accessToken}`,
                },
              })
              .catch((e) => {
                console.error(e.response.data.detail);
              });
          })
          .catch((error) => {
            console.error(error.message);
          });
        resolve(res);
      })
      .catch(reject);
  });
};
