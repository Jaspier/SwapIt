import styled from "styled-components";
import { colors } from "../../../../theme/colors";
import { View, Text, Image } from "react-native";

export const ReceiverMessageBubble = styled(View)`
  background-color: ${colors.bg.brand};
  border-radius: 8px;
  border-top-left-radius: 0px;
  padding: 12px 20px;
  margin: 8px 12px;
  margin-left: 56px;
  align-self: flex-start;
`;

export const ReceiverProfileImage = styled(Image)`
  height: 48px;
  width: 48px;
  border-radius: 9999px;
  position: absolute;
  top: 0px;
  left: -56px;
`;

export const ReceiverMessageText = styled(Text)`
  color: ${colors.text.inverse};
`;
