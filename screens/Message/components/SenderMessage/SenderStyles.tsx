import styled from "styled-components";
import { colors } from "../../../../theme/colors";
import { View, Text } from "react-native";

export const SenderMessageBubble = styled(View)`
  background-color: rgb(147, 51, 234);
  border-radius: ${(props) => props.theme.sizes[0]};
  border-top-right-radius: 0px;
  padding: ${(props) => props.theme.space[3]} ${(props) => props.theme.space[5]};
  margin: ${(props) => props.theme.space[2]} ${(props) => props.theme.space[3]};
  align-self: flex-start;
  margin-left: auto;
`;

export const SenderMessageText = styled(Text)`
  color: ${colors.text.inverse};
`;
