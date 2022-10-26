import React, { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { auth } from "../../firebase";
import { loginRequest } from "./authenticationService";

interface LoginWithEmailAndPassword {
  (arg1: string, arg2: string): void;
}

interface RegisterWithEmailAndPassword {
  (arg1: string, arg2: string, arg3: string): void;
}

interface AuthContextInterface {
  user: UserObj | null;
  loginWithEmailAndPassword: LoginWithEmailAndPassword;
  registerWithEmailAndPassword: RegisterWithEmailAndPassword;
  logout: Logout;
  isLoading: boolean;
  error: string | null;
}

type Props = {
  children?: React.ReactNode;
};

const AuthContext = createContext<AuthContextInterface | null>(null);

export const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState(null);
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
        setIsLoading(false);
      }),
    []
  );

  const loginWithEmailAndPassword = (email: string, password: string) => {
    setIsLoading(true);
    loginRequest(email, password)
      .then((u: any) => {
        setUser(u);
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
        setError(e.toString());
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
      setError("Error: Passwords do not match");
      return;
    }
    createUserWithEmailAndPassword(auth, email, password)
      .then((u: any) => {
        setUser(u);
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
        setError(e.toString());
      });
  };

  const logout = () => {
    signOut(auth).then(() => {
      setUser(null);
      setError(null);
    });
  };

  const sampleAuthContext: AuthContextInterface = {
    user: user,
    loginWithEmailAndPassword,
    registerWithEmailAndPassword,
    logout,
    isLoading: isLoading,
    error: error,
  };
  return (
    <AuthContext.Provider value={sampleAuthContext}>
      {children}
    </AuthContext.Provider>
  );
};

export default function AuthenticationContext() {
  return useContext(AuthContext);
}
