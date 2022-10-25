import { View } from "react-native";
import styled from "styled-components";
import { Button, TextInput } from "react-native-paper";

export const AccountContainer = styled(View)`
  background-color: rgba(255, 255, 255, 0.7);
  padding: 32px;
  margin-top: 8px;
  justify-content: center;
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
`;
