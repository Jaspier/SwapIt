import styled from "styled-components";
import { colors } from "../../theme/colors";
import {
  View,
  Button,
  TextInput,
  KeyboardAvoidingView,
  FlatList,
} from "react-native";

export const MessagesView = styled(KeyboardAvoidingView)`
  flex: 1 1 0%;
`;

export const Messages = styled(FlatList)`
  padding-left: 16px;
`;

export const MessageInputContainer = styled(View)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-top-width: 1px;
  border-color: rgb(229, 231, 235);
  padding-horizontal: 20px;
  padding-vertical: 8px;
`;

export const MessageInput = styled(TextInput)`
  height: 40px;
  width: 85%;
  font-size: 18px;
  line-height: 28px;
`;

export const SendButton = styled(Button).attrs({
  color: colors.brand.primary,
})``;
