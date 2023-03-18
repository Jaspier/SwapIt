import styled from "styled-components";
import { colors } from "../../theme/colors";
import { View, Text } from "react-native";
import { Avatar } from "react-native-paper";
import Slider from "@react-native-community/slider";

export const ProfilePicContainer = styled(View)`
  align-items: center;
`;

export const DefaultProfilePic = styled(Avatar.Text).attrs({
  size: 180,
})`
  background-color: ${colors.bg.account};
`;

export const ProfilePicture = styled(Avatar.Image).attrs({
  size: 180,
})`
  background-color: ${colors.bg.account};
`;

export const SettingsContainer = styled(View)``;

export const UserEmail = styled(Text)`
  text-align: center;
  padding: ${(props) => props.theme.space[4]};
  font-weight: ${(props) => props.theme.fontWeights.bold};
`;

export const SliderContainer = styled(View)`
  justify-content: center;
  align-items: center;
`;

export const DistanceSlider = styled(Slider)`
  width: 300px;
  height: 40px;
`;
