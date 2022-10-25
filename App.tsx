import { NavigationContainer } from "@react-navigation/native";
import { AuthProvider } from "./hooks/authentication/authenticationContext";
import StackNavigator from "./StackNavigator";

export default function App() {
  return (
    <NavigationContainer>
      <AuthProvider>
        <StackNavigator />
      </AuthProvider>
    </NavigationContainer>
  );
}
