import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider } from "./hooks/authentication/authenticationContext";
import StackNavigator from "./StackNavigator";
import { ThemeProvider } from "styled-components";
import { theme } from "./theme";

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
