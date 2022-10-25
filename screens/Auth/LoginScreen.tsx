import React, { useContext, useState } from "react";
import {
  AccountContainer,
  AuthButton,
  AuthInput,
} from "./components/authStyles";
import AuthenticationContext from "../../hooks/authentication/authenticationContext";
import { SafeArea } from "../../components/utilities";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const authContext = AuthenticationContext();
  if (!authContext) {
    return null;
  }
  const { loginWithEmailAndPassword } = authContext;

  return (
    <SafeArea>
      <AccountContainer>
        <AuthInput
          label="E-mail"
          value={email}
          textContentType="emailAddress"
          keyboardType="email-address"
          autoCapitalize="none"
          onChangeText={(u) => setEmail(u)}
        />
        <AuthInput
          label="Password"
          value={password}
          textContentType="password"
          secureTextEntry
          autoCapitalize="none"
          onChangeText={(p) => setPassword(p)}
        />
        <AuthButton
          icon="lock-open-outline"
          mode="contained"
          onPress={() => loginWithEmailAndPassword(email, password)}
        >
          Login
        </AuthButton>
      </AccountContainer>
    </SafeArea>
  );
};

export default LoginScreen;
