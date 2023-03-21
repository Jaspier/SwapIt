import styled from "styled-components";
import { colors } from "../../theme/colors";
import {
  View,
  Button,
  TextInput,
  KeyboardAvoidingView,
  FlatList,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";
import { ActivityIndicator, Avatar } from "react-native-paper";

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

export const MessageBubble = styled(View)<{ sender: boolean; type: string }>`
  background-color: ${(props) =>
    props.sender ? `${colors.brand.secondary}` : `${colors.brand.primary}`};
  border-radius: ${(props) => props.theme.sizes[0]};
  ${(props) =>
    props.sender
      ? `border-top-right-radius: 0px
        `
      : `border-top-left-radius: 0px       
        `};
  padding: ${(props) =>
    props.type === "photo"
      ? `${props.theme.space[2]} ${props.theme.space[3]}`
      : `${props.theme.space[3]} ${props.theme.space[5]}`};
  margin: ${(props) => props.theme.space[2]} ${(props) => props.theme.space[3]};
  margin: ${(props) => props.theme.space[2]} ${(props) => props.theme.space[3]};
  align-self: flex-start;
  margin-left: ${(props) => (props.sender ? `auto` : `56px`)};
`;

export const MessagePhoto = styled(Image)`
  height: 125px;
  width: 125px;
`;

export const MessageText = styled(Text)`
  color: ${colors.text.inverse};
`;

export const PhotoPreviewContainer = styled(View)`
  height: 100px;
  width: 100px;
  justify-content: center;
  align-items: center;
  margin-top: ${(props) => props.theme.space[3]};
  left: ${(props) => props.theme.space[5]};
  bottom: ${(props) => props.theme.space[5]};
`;

export const LoadingCircle = styled(ActivityIndicator)`
  top: 60px;
  z-index: 9999;
`;

export const PhotoPreview = styled(Image)`
  height: 100px;
  width: 100px;
`;

export const ProfileImageTouchable = styled(TouchableOpacity)<{ type: string }>`
  top: -15px;
  left: ${(props) => (props.type === "photo" ? `-73px` : `-81px`)};
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

export const CameraButton = styled(TouchableOpacity)`
  margin-right: 10px;
  top: 3px;
`;

export const MessageInput = styled(TextInput)`
  height: 40px;
  width: 75%;
  font-size: ${(props) => props.theme.fontSizes.default};
  line-height: ${(props) => props.theme.lineHeights.title};
`;

export const SendButton = styled(Button).attrs({
  color: colors.brand.primary,
})``;
