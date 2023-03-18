import styled from "styled-components";
import { colors } from "../../theme/colors";
import { Avatar } from "react-native-paper";
import { View, Text, Image, TouchableOpacity } from "react-native";
import Swiper from "react-native-deck-swiper";

export const HeaderContainer = styled(View)`
  flex-direction: row;
  align-items: center;
  justify-content: space-between
  position: relative;
  padding-horizontal: ${(props) => props.theme.space[5]}
`;

export const DefaultAccountIcon = styled(Avatar.Text).attrs({
  size: 40,
})`
  background-color: ${colors.bg.account};
`;

export const AccountImage = styled(Avatar.Image).attrs({
  size: 40,
})`
  background-color: ${colors.bg.account};
`;

export const Logo = styled(Text)`
  font-size: ${(props) => props.theme.fontSizes.h4};
  font-weight: ${(props) => props.theme.fontWeights.medium};
  color: ${colors.brand.primary};
`;

export const SwiperContainer = styled(View)`
  flex: 1;
  margin-top: -24px;
`;

export const DeckSwiper = styled(Swiper).attrs({
  containerStyle: { backgroundColor: "transparent" },
})``;

export const SwipeButtonsContainer = styled(View)`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
`;

export const SwipeButton = styled(TouchableOpacity)<{ type: string }>`
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  width: 64px;
  height: 64px;
  background-color: ${(props) =>
    props.type === "swap"
      ? "rgb(187, 247, 208)"
      : props.type === "cross"
      ? "rgb(254, 202, 202)"
      : "none"};
`;

export const NoProfilesCard = styled(View)`
  position: relative;
  background-color: ${colors.bg.primary};
  height: 75%;
  border-radius: ${(props) => props.theme.sizes[1]};
  justify-content: center;
  align-items: center;
  box-shadow: 0px 1px rgba(0, 0, 0, 0.2);
`;

export const NoProfilesText = styled(Text)`
  font-weight: ${(props) => props.theme.fontWeights.bold};
  padding-bottom: ${(props) => props.theme.space[5]};
`;

export const NoProfilesImage = styled(Image)`
  height: 100px;
  width: 100px;
`;
