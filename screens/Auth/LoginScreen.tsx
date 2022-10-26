import React, { useState } from "react";
import {
  AuthContainer,
  AuthButton,
  AuthInput,
  ErrorContainer,
  AuthBackground,
  Title,
} from "./components/authStyles";
import AuthenticationContext from "../../hooks/authentication/authenticationContext";
import { FullArea, Spacer } from "../../components/utilities";
import { ErrorText, Label, LinkedLabel } from "../../components/typography";
import { ActivityIndicator, Colors } from "react-native-paper";

const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const authContext = AuthenticationContext();
  if (!authContext) {
    return null;
  }
  const { loginWithEmailAndPassword, isLoading, error } = authContext;

  return (
    <FullArea>
      <AuthBackground>
        <Title>SwapIt</Title>
        <AuthContainer>
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
          {error && (
            <ErrorContainer>
              <ErrorText>{error}</ErrorText>
            </ErrorContainer>
          )}
          {!isLoading ? (
            <AuthButton
              icon="lock-open-outline"
              mode="contained"
              onPress={() => loginWithEmailAndPassword(email, password)}
            >
              Login
            </AuthButton>
          ) : (
            <ActivityIndicator animating={true} color={Colors.blue300} />
          )}
        </AuthContainer>
        <Spacer />
        <Label>
          Don't have an account?{" "}
          <LinkedLabel onPress={() => navigation.navigate("Register")}>
            Click here to Register.
          </LinkedLabel>
        </Label>
      </AuthBackground>
    </FullArea>
  );
};

export default LoginScreen;
