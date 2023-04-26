import React, { useState } from "react";
import {
  AuthContainer,
  AuthButton,
  AuthInput,
  ErrorContainer,
  AuthBackground,
  Title,
  AuthKeyboardAvoidingView,
  PasswordContainer,
  EyeContainer,
  Eye,
} from "./components/authStyles";
import AuthenticationContext from "../../hooks/authentication/authenticationContext";
import { FullArea, Spacer } from "../../components/utilities";
import { ErrorText, Label, LinkedLabel } from "../../components/typography";
import { ActivityIndicator, Colors } from "react-native-paper";
import { Keyboard, TouchableWithoutFeedback, Platform } from "react-native";

const LoginScreen = ({ navigation }: any) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const authContext = AuthenticationContext();
  if (!authContext) {
    return null;
  }
  const { loginWithEmailAndPassword, isLoading, error } = authContext;

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

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
              <PasswordContainer>
                <AuthInput
                  label="Password"
                  value={password}
                  textContentType="password"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  onChangeText={(p) => setPassword(p)}
                />
                <EyeContainer onPress={togglePasswordVisibility}>
                  <Eye
                    name={showPassword ? "eye" : "eye-with-line"}
                    size={24}
                  />
                </EyeContainer>
              </PasswordContainer>
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
        </AuthKeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </FullArea>
  );
};

export default LoginScreen;
