import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider } from "./hooks/authentication/authenticationContext";
import { NotificationListener } from "./hooks/notifications/notificationContext";
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

axios.defaults.baseURL = "https://swapit-api.herokuapp.com";

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <NavigationContainer>
        <AuthProvider>
          <NotificationListener>
            <StackNavigator />
          </NotificationListener>
        </AuthProvider>
      </NavigationContainer>
    </ThemeProvider>
  );
}
