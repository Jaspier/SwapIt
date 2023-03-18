import { Text, TouchableOpacity, View } from "react-native";
import styled from "styled-components";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../theme/colors";

export const HeaderContainer = styled(View)`
  padding: ${(props) => props.theme.space[2]};
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const NavContainer = styled(View)`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const GoBackButton = styled(TouchableOpacity)`
  padding: ${(props) => props.theme.space[2]};
`;

export const Chevron = styled(Ionicons).attrs({
  name: "chevron-back-outline",
  size: 34,
  color: colors.brand.primary,
})``;

export const HeaderTextContainer = styled(View)`
  display: flex;
`;

export const Title = styled(Text)`
  font-size: ${(props) => props.theme.fontSizes.h5};
  line-height: ${(props) => props.theme.lineHeights.title};
  font-weight: ${(props) => props.theme.fontWeights.bold};
  padding-left: ${(props) => props.theme.space[2]};
`;

export const SubHeading = styled(Text)`
  margin-left: ${(props) => props.theme.space[2]};
`;

export const NFCButton = styled(TouchableOpacity)`
  border-radius: 9999px;
  margin-right: ${(props) => props.theme.space[4]};
  padding: ${(props) => props.theme.space[3]};
  background-color: ${colors.bg.light};
`;

export const SettingsButton = styled(TouchableOpacity)`
  margin-right: ${(props) => props.theme.space[4]};
`;
