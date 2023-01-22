import styled from "styled-components";
import { colors } from "../../theme/colors";
import { View, Text, Image, TouchableOpacity } from "react-native";

export const MatchedContainer = styled(View)`
  position: absolute;
  height: 100%;
  background-color: ${colors.bg.brand};
  padding-top: 100px;
  opacity: 0.89;
`;

export const HeaderContainer = styled(View)`
  justify-content: center;
  padding-horizontal: 40px;
  padding-top: 80px;
`;

export const Header = styled(Text)`
  height: 80px;
  width: 100%;
  font-size: 36px;
  line-height: 40px;
  color: ${colors.text.inverse};
`;

export const Subheader = styled(Text)`
  color: ${colors.text.inverse};
  text-align: center;
  margin-top: -15px;
  margin-bottom: 30px;
`;

export const ImagesContainer = styled(View)`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  margin-top: 20px;
`;

export const ProfileImage = styled(Image)`
  height: 128px;
  width: 128px;
  border-radius: 9999px;
`;

export const ChatButton = styled(TouchableOpacity)`
  background-color: ${colors.bg.primary};
  margin: 20px;
  padding-horizontal: 40px;
  padding-vertical: 32px;
  border-radius: 9999px;
  margin-top: 80px;
`;

export const ChatButtonText = styled(Text)`
  text-align: center;
`;
