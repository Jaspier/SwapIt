import styled from "styled-components";
import { colors } from "../../theme/colors";
import {
  View,
  Button,
  TextInput,
  KeyboardAvoidingView,
  FlatList,
  Text,
} from "react-native";

export const StatusIndicator = styled(View)<{ status: string }>`
  height: 12px;
  width: 12px;
  border-radius: 9999px;
  background-color: ${(props) =>
    props.status === "online"
      ? colors.brand.primary
      : props.status === "offline"
      ? colors.text.disabled
      : "none"};
  margin-left: ${(props) => props.theme.space[2]};
  margin-right: ${(props) => props.theme.space[1]};
`;

export const StatusText = styled(Text)`
  color: ${colors.text.disabled};
`;

export const MessagesView = styled(KeyboardAvoidingView)`
  flex: 1 1 0%;
`;

export const Messages = styled(FlatList)`
  padding-left: ${(props) => props.theme.space[4]};
`;

export const MessageInputContainer = styled(View)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  border-top-width: 1px;
  border-color: rgb(229, 231, 235);
  padding-horizontal: ${(props) => props.theme.space[5]};
  padding-vertical: ${(props) => props.theme.space[2]};
`;

export const MessageInput = styled(TextInput)`
  height: 40px;
  width: 85%;
  font-size: ${(props) => props.theme.fontSizes.default};
  line-height: ${(props) => props.theme.lineHeights.title};
`;

export const SendButton = styled(Button).attrs({
  color: colors.brand.primary,
})``;
