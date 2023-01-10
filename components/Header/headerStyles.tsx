import { Text, TouchableOpacity, View } from "react-native";
import styled from "styled-components";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../../theme/colors";

export const HeaderContainer = styled(View)`
  padding: 8px;
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
  padding: 8px;
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
  font-size: 24px;
  line-height: 32px;
  font-weight: 700;
  padding-left: 8px;
`;

export const SubHeading = styled(Text)`
  margin-left: 8px;
`;

export const NFCButton = styled(TouchableOpacity)`
  border-radius: 9999px;
  margin-right: 16px;
  padding: 12px;
  background-color: rgb(187, 247, 208);
`;
