import React, { createContext, useContext } from "react";

interface AuthContextInterface {
  user: any;
}

const AuthContext = createContext<AuthContextInterface | null>(null);

const sampleAuthContext: AuthContextInterface = {
  user: null,
};

export const AuthProvider = ({ children }: any) => {
  return (
    <AuthContext.Provider value={sampleAuthContext}>
      {children}
    </AuthContext.Provider>
  );
};

export default function AuthenticationContext() {
  return useContext(AuthContext);
}
