import styled from "styled-components";
import { colors } from "../../../../theme/colors";
import { View, Text, Image } from "react-native";
import { Avatar } from "react-native-paper";
import { TouchableOpacity } from "react-native";

export const ReceiverMessageBubble = styled(View)`
  background-color: ${colors.bg.brand};
  border-radius: ${(props) => props.theme.sizes[0]};
  border-top-left-radius: 0px;
  padding: ${(props) => props.theme.space[3]} ${(props) => props.theme.space[5]};
  margin: ${(props) => props.theme.space[2]} ${(props) => props.theme.space[3]};
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
