import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider } from "./hooks/authentication/authenticationContext";
import StackNavigator from "./StackNavigator";
import { ThemeProvider } from "styled-components";
import { theme } from "./theme";
import axios from "axios";
import { Amplify } from "aws-amplify";
import awsconfig from "./aws-exports";
Amplify.configure({
  ...awsconfig,
  Analytics: {
    disabled: true,
  },
});

axios.defaults.baseURL = "http://127.0.0.1:8000";

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <NavigationContainer>
        <AuthProvider>
          <StackNavigator />
        </AuthProvider>
      </NavigationContainer>
    </ThemeProvider>
  );
}
