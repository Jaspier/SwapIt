import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "../../firebase";
import { loginRequest } from "./authenticationService";

type Props = {
  children?: React.ReactNode;
};

const AuthContext = createContext<AuthContextInterface | null>(null);

export const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState(null);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(
    () =>
      onAuthStateChanged(auth, (u: any) => {
        if (u) {
          setUser(u);
        } else {
          setUser(null);
        }
        setLoadingInitial(false);
      }),
    []
  );

  const loginWithEmailAndPassword = (email: string, password: string) => {
    setIsLoading(true);
    loginRequest(email, password)
      .then((u: any) => {
        if (u.data.status_code === 400) {
          setIsLoading(false);
          setError(u.data.detail.message);
          return;
        }
        setUser(u);
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
        if (e.code === "auth/invalid-email") {
          setError("Error: Invalid Email. Format should be: example@test.com");
        } else if (e.code === "auth/wrong-password") {
          setError("Error: Incorrect Password.");
        } else if (e.code === "auth/user-not-found") {
          setError("Error: User does not exist.");
        } else {
          setError(e.message);
        }
        setTimeout(() => setError(null), 5000);
      });
  };

  const registerWithEmailAndPassword = (
    email: string,
    password: string,
    repeatedPassword: string
  ) => {
    setIsLoading(true);
    if (password !== repeatedPassword) {
      setIsLoading(false);
      setError("Error: Passwords do not match.");
      return;
    }
    createUserWithEmailAndPassword(auth, email, password)
      .then((u: any) => {
        if (u.data.status_code === 400) {
          setIsLoading(false);
          setError(u.data.detail.message);
          return;
        }
        setUser(u);
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
        if (e.code === "auth/invalid-email") {
          setError("Error: Invalid Email. Format should be: example@test.com");
        } else {
          setError(e.message);
        }
        setTimeout(() => setError(null), 5000);
      });
  };

  const logout = () => {
    signOut(auth).then(() => {
      setUser(null);
      setError(null);
    });
  };

  const memoedValue: AuthContextInterface = useMemo(
    () => ({
      user: user,
      loginWithEmailAndPassword,
      registerWithEmailAndPassword,
      logout,
      isLoading: isLoading,
      error: error,
    }),
    [user, isLoading, error]
  );

  return (
    <AuthContext.Provider value={memoedValue}>
      {!loadingInitial && children}
    </AuthContext.Provider>
  );
};

export default function AuthenticationContext() {
  return useContext(AuthContext);
}
