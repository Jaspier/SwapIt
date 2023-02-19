import styled from "styled-components";
import { colors } from "../../../../theme/colors";
import { View, Text, Image } from "react-native";
import { Avatar } from "react-native-paper";
import { TouchableOpacity } from "react-native";

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
`;

export const DefaultReceiverProfileImage = styled(Avatar.Text).attrs({
  size: 48,
})`
  background-color: ${colors.bg.account};
  border-radius: 9999px;
  position: absolute;
`;

export const ReceiverMessageText = styled(Text)`
  color: ${colors.text.inverse};
`;

export const ProfileImageTouchable = styled(TouchableOpacity)`
  top: -15px;
  left: -78px;
`;
