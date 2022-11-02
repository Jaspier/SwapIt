import styled from "styled-components";
import { colors } from "../../theme/colors";
import { Avatar } from "react-native-paper";
import { View, Text } from "react-native";

export const HeaderContainer = styled(View)`
  flex-direction: row;
  align-items: center;
  justify-content: space-between
  position: relative;
  padding-left: 20px;
  padding-right: 20px;
`;

export const AvatarIcon = styled(Avatar.Text).attrs({
  size: 40,
})`
  background-color: ${colors.bg.account};
`;

export const Logo = styled(Text)`
  font-size: 25px;
  font-weight: 500;
  color: ${colors.brand.primary};
`;
