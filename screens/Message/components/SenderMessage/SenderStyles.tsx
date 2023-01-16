import styled from "styled-components";
import { colors } from "../../../../theme/colors";
import { View, Text } from "react-native";

export const SenderMessageBubble = styled(View)`
  background-color: rgb(147, 51, 234);
  border-radius: 8px;
  border-top-right-radius: 0px;
  padding: 12px 20px;
  margin: 8px 12px;
  align-self: flex-start;
  margin-left: auto;
`;

export const SenderMessageText = styled(Text)`
  color: ${colors.text.inverse};
`;
