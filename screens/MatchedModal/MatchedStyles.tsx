import styled from "styled-components";
import { colors } from "../../theme/colors";
import { View, Text, Image, TouchableOpacity } from "react-native";

export const TouchableContainer = styled(TouchableOpacity)`
  height: 100%;
`;

export const MatchedContainer = styled(View)`
  position: absolute;
  height: 100%;
  width: 100%;
  background-color: ${colors.bg.brand};
  padding-top: ${(props) => props.theme.space[8]};
  opacity: 0.89;
`;

export const HeaderContainer = styled(View)`
  justify-content: center;
  padding-horizontal: 42px;
  padding-top: 80px;
`;

export const Header = styled(Text)`
  height: 80px;
  width: 110%;
  font-size: ${(props) => props.theme.fontSizes.h4};
  line-height: 40px;
  color: ${colors.text.inverse};
`;

export const Subheader = styled(Text)`
  color: ${colors.text.inverse};
  font-size: ${(props) => props.theme.fontSizes.body}
  text-align: center;
  margin-top: -${(props) => props.theme.space[5]};
  margin-bottom: ${(props) => props.theme.space[6]};
`;

export const ImagesContainer = styled(View)`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  margin-top: ${(props) => props.theme.space[5]};
`;

export const ProfileImage = styled(Image)`
  height: 128px;
  width: 128px;
  border-radius: 9999px;
`;

export const ChatButton = styled(TouchableOpacity)`
  background-color: ${colors.bg.primary};
  margin: ${(props) => props.theme.space[5]};
  padding-horizontal: 40px;
  padding-vertical: 32px;
  border-radius: 9999px;
  margin-top: 80px;
`;

export const ChatButtonText = styled(Text)`
  text-align: center;
`;
