import React, { createContext, useContext, useEffect, useState } from "react";
import { loginRequest } from "./authenticationService";

interface AuthContextInterface {
  user: any;
  loginWithEmailAndPassword: any;
  error: any;
}

const AuthContext = createContext<AuthContextInterface | null>(null);

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  const loginWithEmailAndPassword = (email: any, password: any) => {
    loginRequest(email, password)
      .then((u: any) => {
        setUser(u);
      })
      .catch((e) => {
        setError(e.toString());
      });
  };

  const sampleAuthContext: AuthContextInterface = {
    user: user,
    loginWithEmailAndPassword,
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
