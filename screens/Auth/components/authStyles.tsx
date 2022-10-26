import { View, ImageBackground, TouchableOpacity, Text } from "react-native";
import styled from "styled-components";
import { Button, TextInput } from "react-native-paper";

export const AuthBackground = styled(ImageBackground).attrs({
  source: require("../../../assets/background.jpg"),
  resizeMode: "cover",
})`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const Title = styled(Text)`
  font-size: 30px;
  color: #fff;
`;

export const SplashButton = styled(TouchableOpacity)`
  position: absolute;
  bottom: 15%;
  width: 50%;
  background-color: #fff;
  padding: 16px;
  border-radius: 30%;
`;

export const SplashText = styled(Text)`
  font-weight: 600;
  text-align: center;
`;

export const AuthContainer = styled(View)`
  background-color: rgba(255, 255, 255, 0.4);
  padding: 32px;
  margin-top: 8px;
  align-items: center;
`;

export const AuthButton = styled(Button).attrs({
  color: "lightgreen",
})`
  padding: 8px;
  margin-top: 32px;
`;

export const AuthInput = styled(TextInput)`
  width: 300px;
  background-color: transparent;
`;

export const ErrorContainer = styled(View)`
  max-width: 300px;
  align-items: center;
  align-self: center;
  margin-top: 8px;
  margin-bottom: 8px;
`;
