import styled from "styled-components";
import { colors } from "../../theme/colors";
import { Avatar } from "react-native-paper";
import { View, Text, Image } from "react-native";
import Swiper from "react-native-deck-swiper";

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

export const SwiperContainer = styled(View)`
  flex: 1;
  margin-top: -24px;
`;

export const DeckSwiper = styled(Swiper).attrs({
  containerStyle: { backgroundColor: "transparent" },
})``;

export const Card = styled(View)`
  position: relative;
  background-color: white;
  height: 75%;
  border-radius: 12px;
`;

export const CardImage = styled(Image)`
  position: absolute;
  top: 0;
  height: 100%;
  width: 100%;
  border-radius: 12px;
`;
