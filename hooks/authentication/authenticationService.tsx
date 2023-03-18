import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import * as Notifications from "expo-notifications";
import displayError from "../../lib/displayError";
import { storeDeviceToken } from "../../api";

export const loginRequest = (email: string, password: string) => {
  return new Promise((resolve, reject) => {
    signInWithEmailAndPassword(auth, email, password)
      .then((res: any) => {
        Notifications.getExpoPushTokenAsync()
          .then((response) => {
            const deviceToken = response.data;
            const accessToken = res.user.stsTokenManager.accessToken;
            storeDeviceToken(accessToken, deviceToken);
          })
          .catch((error) => {
            displayError(error.message);
          });
        resolve(res);
      })
      .catch(reject);
  });
};
