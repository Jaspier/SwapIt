import React, { useState } from "react";
import {
  AuthContainer,
  AuthButton,
  AuthInput,
  ErrorContainer,
  AuthBackground,
  Title,
  AuthKeyboardAvoidingView,
} from "./components/authStyles";
import AuthenticationContext from "../../hooks/authentication/authenticationContext";
import { FullArea, Spacer } from "../../components/utilities";
import { ErrorText, Label, LinkedLabel } from "../../components/typography";
import { ActivityIndicator, Colors } from "react-native-paper";
import { Keyboard, Platform, TouchableWithoutFeedback } from "react-native";

const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatedPassword, setRepeatedPassword] = useState("");
  const authContext = AuthenticationContext();
  if (!authContext) {
    return null;
  }
  const { registerWithEmailAndPassword, isLoading, error } = authContext;

  return (
    <FullArea>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <AuthKeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={10}
        >
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
              <AuthInput
                label="Repeat Password"
                value={repeatedPassword}
                textContentType="password"
                secureTextEntry
                autoCapitalize="none"
                onChangeText={(p) => setRepeatedPassword(p)}
              />
              {error && (
                <ErrorContainer>
                  <ErrorText>{error}</ErrorText>
                </ErrorContainer>
              )}
              {!isLoading ? (
                <AuthButton
                  icon="email-outline"
                  mode="contained"
                  onPress={() =>
                    registerWithEmailAndPassword(
                      email,
                      password,
                      repeatedPassword
                    )
                  }
                >
                  Register
                </AuthButton>
              ) : (
                <ActivityIndicator animating={true} color={Colors.blue300} />
              )}
            </AuthContainer>
            <Spacer />
            <Label>
              Have an account already?{" "}
              <LinkedLabel onPress={() => navigation.navigate("Login")}>
                Click here to Login.
              </LinkedLabel>
            </Label>
          </AuthBackground>
        </AuthKeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </FullArea>
  );
};

export default LoginScreen;
