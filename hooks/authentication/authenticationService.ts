import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";

export const loginRequest = (email: any, password: any) => {
  return new Promise((resolve, reject) => {
    signInWithEmailAndPassword(auth, email, password)
      .then((res) => {
        resolve(res);
      })
      .catch(reject);
  });
};